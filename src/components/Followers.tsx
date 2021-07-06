import { User } from "@libs/types";
import { FunctionComponent } from "react";
import useSWR from "swr";
import Loader from "./Loader";
import UserCard from "./UserCard";

const Followers: FunctionComponent<{ userId: string }> = ({ userId }) => {
  const { data: followers } = useSWR<User[]>(
    `/api/users/${userId}/followers`
  );

  return (
    <div>
      {!followers ? (
        <Loader />
      ) : (
        followers.map((user) => <UserCard user={user} showFollowButton={true} key={user._id}/>)
      )}
    </div>
  );
};

export default Followers;
