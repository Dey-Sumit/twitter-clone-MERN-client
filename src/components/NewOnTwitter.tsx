import { useRouter } from "next/router";
import React from "react";

const NewOnTwitter = () => {
  const { push } = useRouter();
  return (
    <div className="p-3 flex flex-col space-y-3 items-center border mx-2 border-gray-600 rounded-2xl my-6">
      <h4 className="text-3xl font-semibold">New on twitty?</h4>
      <p className="text-lg">Sign up now to get your own personalized timeline!</p>
      <button onClick={() => push("/auth")} className="bg-dark-700 rounded-full py-2 px-10 shadow hover:bg-dark-600">
        Sign up with email
      </button>
    </div>
  );
};

export default NewOnTwitter;
