import TweetCard from "@components/TweetCard";
import Trends from "@components/Trends";
import People from "@components/People";
import CreateTweet from "@components/CreateTweet";
import Loader from "@components/Loader";
import { useAuthState } from "@context/auth.context";
import { usePaginatedPosts } from "@libs/hooks";

import { useRouter } from "next/router";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect } from "react";

export default function Home() {
  const { push } = useRouter();

  const { user } = useAuthState();
  const { error, posts, page, setPage, isReachingEnd } = usePaginatedPosts("/api/posts/feed");

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true); // solves the hydration problem
  }, []);

  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      <div className="col-span-8 md:col-span-5">
        <div className="h-[90vh] overflow-y-auto">
          {user ? (
            <CreateTweet />
          ) : (
            <div className="p-3 text-center">
              <p>Sign in to talk to the world 😉</p>
              <button onClick={() => push("/auth")} className="mx-auto mt-3 button">
                Sign up / Sign in
              </button>
            </div>
          )}
          {!error && !posts && <Loader />}
          {error && <h3 className="customText-h3">Could not load the post, Server Error</h3>}
          {user && posts.length === 0 ? (
            <h3 className=" customText-h3">
              You don't have any posts in your feed, create one or follow someone!
            </h3>
          ) : (
            <InfiniteScroll
              dataLength={posts.length}
              next={() => setPage(page + 1)}
              hasMore={!isReachingEnd}
              loader={mounted && <Loader />}
              endMessage={mounted && !error && <p className="customText-h3">No more posts</p>}
            >
              {posts?.map((tweet) => (
                <TweetCard tweet={tweet} key={tweet._id.toString()} />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
      <div className="hidden col-span-8 py-4 space-y-4 md:col-span-3 md:block">
        <Trends noOfElements={5} />
        <People noOfElements={5} />
      </div>
    </div>
  );
}
