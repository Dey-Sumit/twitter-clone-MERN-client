import axios from "axios";
import { useAuthState } from "@context/auth.context";
import { User } from "@libs/types";
import Image from "next/image";
import { useRouter } from "next/router";
import { FunctionComponent, MouseEvent, useEffect, useState } from "react";
import { mutate } from "swr";

const UserCard: FunctionComponent<{
  user: User;
  showFollowButton: Boolean;
}> = ({ user, showFollowButton = true }) => {
  const { user: authUser } = useAuthState();

  const [isFollowing, setIsFollowing] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const temp = authUser && user?.followers?.includes(authUser._id);

    setIsFollowing(temp);
  }, [user, authUser]);

  const handleFollow = async (e: MouseEvent<any>) => {
    e.stopPropagation();
    if (loading) return;

    const ENDPOINT = `/api/users/${user._id}/follow`;
    try {
      setLoading(true);
      await axios.put(ENDPOINT);
      setIsFollowing((value) => !value);

      // update the followers and followings
      mutate(`/api/users/${authUser._id}/followings`);
      mutate(`/api/users/${authUser._id}`);
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const { push } = useRouter();
  return (
    <div
      className="flex items-center px-3 py-1 text-sm cursor-pointer md:text-base"
      onClick={() => push(`/user/${user._id}`)}
      key={user._id}
    >
      <Image
        width={48}
        height={48}
        objectFit="cover"
        quality={100}
        src={user.profilePicture}
        alt=""
        className="rounded-full "
      />
      <div className="flex flex-col ml-3 space-y-1">
        <span className="text-lg text-white">{user.username}</span>
        <span className="">Followers : {user.noOfFollowers}</span>
      </div>
      {showFollowButton && user._id !== authUser._id && (
        <button
          onClick={handleFollow}
          className={`${
            isFollowing ? "bg-blue-500 text-white" : "text-blue-500"
          } px-3 py-1 ml-auto  border-2 border-blue-500 rounded-full cursor-pointer `}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default UserCard;
