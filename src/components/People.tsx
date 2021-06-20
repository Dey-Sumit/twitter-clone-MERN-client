import { FUser } from "libs/types";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import useSWR from "swr";
import Loader from "./Loader";
import UserCard from "./UserCard";

const People: FunctionComponent<{ noOfElements?: number }> = ({ noOfElements }) => {
  const { data: users, error } = useSWR<FUser[]>("/api/users/topUsers");

  return (
    <div className="flex flex-col p-2 space-y-3 divide-y shadow-sm rounded-2xl bg-dark-600 divide-dark-500">
      <h3 className="px-3 py-1 text-xl font-bold text-white">People you may like</h3>
      {error && !users && <h3 className="customText-h3">Could not load</h3>}
      {users ? (
        users
          .slice(0, noOfElements)
          .map((user) => (
            <UserCard user={user} showFollowButton={false} key={user._id.toString()} />
          ))
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default People;
