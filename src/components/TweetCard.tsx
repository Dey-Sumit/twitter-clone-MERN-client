import axios from "axios";
import { FunctionComponent, useState } from "react";
import { BsClockHistory } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/router";

import { Post } from "@libs/types";
import timeSince from "@libs/timeSince";
import { usePaginatedPosts } from "@libs/hooks";
import { useAuthState } from "@context/auth.context";
import { useLayoutDispatch } from "@context/layout.context";
import { useSocket } from "@context/socket.context";
import { useSnackbar } from "notistack";

const Hash: FunctionComponent<{ children: string }> = ({ children }) => {
  const { push } = useRouter();

  return (
    <span
      className="text-blue-600"
      onClick={(e) => {
        e.stopPropagation();
        push(`/tags/${children.slice(1)}`);
      }}
    >
      {children}{" "}
    </span>
  );
};

const TweetCard: FunctionComponent<{ tweet: Post }> = ({
  tweet: {
    content,
    user: { _id: uid, name, username, profilePicture },
    likes,
    comments,
    attachmentURL,
    _id,
    createdAt,
    tags,
    clientOnly,
  },
}) => {
  const { pathname } = useRouter();
  const socket = useSocket();

  const { user } = useAuthState();
  const dispatch = useLayoutDispatch();
  // const { showDeleteModal, postId } = useLayoutState();
  const { mutate: paginatedPostsMutate } = usePaginatedPosts("/api/posts/feed");
  // const { socket } = useSocket();

  // const extractedTags = tags.map((tag) => tag.name);
  const { push } = useRouter();
  const [likesCount, setLikesCount] = useState<number>(likes ? likes.length : 0);
  const [likedByMe, setLikedByMe] = useState<boolean>(likes?.includes(user?._id));

  // console.log({likedByMe,likes,user});

  const handleLike = async (e: any) => {
    e.stopPropagation();
    if (!user) {
      dispatch({
        type: "SHOW_AUTH_MODAL",
      });
      return;
    }
    likedByMe ? setLikesCount(likesCount - 1) : setLikesCount(likesCount + 1);
    // don't send noti if my post is liked by me 🙄
    if (uid !== user._id && !likedByMe)
      socket.emit("NOTIFY", {
        userTo: uid,
        message: `${user.name} liked your post`,
      });

    setLikedByMe((value) => !value);
    await axios.put(`/api/posts/${_id}/rate`);
  };
  const handleDelete = async (e: any) => {
    e.stopPropagation();
    await axios.delete(`/api/posts/${_id}/`);
    paginatedPostsMutate();
    dispatch({
      type: "HIDE_CONFIRMATION_MODAL",
    });

    if (pathname === "/tweet/[tid]") {
      push("/");
    }
  };
  const showModal = async (e: any) => {
    e.stopPropagation();
    dispatch({
      type: "SHOW_CONFIRMATION_MODAL",
      payload: {
        subTitle: `This can’t be undone `,
        handleConfirmation: handleDelete,
        buttonText: "Delete",
      },
    });
  };

  // const handleTags = (e, tag: string) => {
  //   e.stopPropagation();

  //   push(`/tags/${tag}`);
  // };
  // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjIwP9FAQJOd8w7eHWWcjJyZnUwZN8ENSjFg&usqp=CAU

  return (
    <div className="flex p-2 space-x-3 ">
      {/* <div className="relative"> */}
      <div className="flex-shrink-0 cursor-pointer ">
        <Image
          width={44}
          height={44}
          layout="fixed"
          objectFit="cover"
          quality={100}
          src={profilePicture}
          alt=""
          onClick={() => push(`/user/${uid}`)}
          className="rounded-full "
        />
      </div>
      <div
        className="flex-col w-full p-3 px-4 space-y-3 rounded-md shadow-sm cursor-pointer bg-dark-600"
        onClick={() => !clientOnly && push(`/tweet/${_id}`)}
      >
        {/* top */}
        <div className="flex items-center">
          <span className="flex-shrink-0 text-white">{name}</span>
          <span className="flex-shrink-0 ml-2 overflow-hidden text-gray-200 cursor-pointer overflow-ellipsis flex-grow-1 whitespace-nowrap ">
            @{username}
          </span>
          {clientOnly && (
            <span className="w-3 h-3 ml-3 bg-blue-700 rounded-full animate-pulse"></span>
          )}
          <div className="flex items-center flex-shrink-0 ml-auto space-x-2">
            <BsClockHistory size="14" className="hidden md:block" />{" "}
            <span>{timeSince(new Date(createdAt))}</span>
          </div>
        </div>
        <div className="text-lg whitespace-pre-wrap">
          {content.split(" ").map((word, i) => {
            return word[0] !== "#" ? <span key={i}>{word} </span> : <Hash key={i}>{word}</Hash>;
          })}
        </div>
        {attachmentURL && (
          <div className="relative  h-[280px] mx-auto tweetCardImage__wrapper">
            {/* //! Next image does not support blob */}
            {clientOnly ? (
              <img
                src={attachmentURL}
                alt="attachment"
                className="object-contain w-full h-full border rounded-xl"
              />
            ) : (
              <Image
                layout="fill"
                quality={100}
                objectFit="contain"
                src={attachmentURL}
                alt="attachment"
              />
            )}
          </div>
        )}
        <div className="flex justify-around ">
          <div className="flex items-center space-x-2 cursor-pointer">
            <FaRegComment
              size={34}
              className="p-2 rounded-full hover:bg-blue-600 hover:bg-opacity-30 hover:text-blue-600"
            />
            {/*// for optimistic UI 👇 */}
            <span>{comments ? comments.length : 0}</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={handleLike}>
            {/* <Heart isClick={likedByMe}  /> */}
            {!likedByMe ? (
              <AiOutlineHeart
                className="p-2 rounded-full hover:bg-red-700 hover:bg-opacity-30 hover:text-red-600"
                size={35}
              />
            ) : (
              <FaHeart size={35} className="p-2 text-red-600" />
            )}

            <span>{likesCount}</span>
          </div>
          {/* <div className="flex items-center space-x-2 cursor-pointer">
            <AiOutlineRetweet size={21} />
            <span>34</span>
          </div> */}
          {/* <div className="flex items-center space-x-2 cursor-pointer">
            <IoMdShareAlt
              size={22}
              className="p-2 text-red-500 rounded-full hover:bg-red-600 hover:bg-opacity-30 hover:text-red-600"
            />
          </div> */}
          {user?._id == uid && (
            <MdDelete
              size={35}
              className="p-2 text-red-500 rounded-full hover:bg-red-600 hover:bg-opacity-30 hover:text-red-600"
              onClick={showModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
