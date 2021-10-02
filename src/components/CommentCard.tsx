import { BsClockHistory } from "react-icons/bs";
import { FunctionComponent } from "react";
import { Comment } from "@libs/types";
import { useRouter } from "next/router";
import timeSince from "@libs/timeSince";
import Image from "next/image";
const CommentCard: FunctionComponent<{ data: Comment }> = ({
  data: {
    date,
    content,
    user: { name, username, profilePicture },
    _id,
    clientOnly,
  },
}) => {
  const { push } = useRouter();

  return (
    <div className="flex p-2 space-x-3 text-sm md:text-base">
      <div className="flex-shrink-0 w-8 h-8">
        <Image
          src={profilePicture}
          alt=""
          width={40}
          height={40}
          className="flex-shrink-0 rounded-full cursor-pointer"
          onClick={() => push(`/user/${username}`)}
        />
      </div>
      <div className="flex-col w-full p-3 px-4 space-y-3 rounded-md shadow-sm cursor-pointer bg-dark-600">
        {/* top */}
        <div className="flex items-center">
          <span className="text-white">{name}</span>
          <span className="ml-2 text-gray-400 cursor-pointer hover:text-blue-700">@{username}</span>
          {clientOnly && <span className="w-3 h-3 ml-3 bg-blue-700 rounded-full animate-pulse"></span>}
          <div className="flex items-center ml-auto space-x-2">
            <BsClockHistory size="14" /> {!clientOnly && <span>{timeSince(new Date(date))}</span>}
          </div>
        </div>
        <div>{content}</div>
      </div>
    </div>
  );
};

export default CommentCard;
