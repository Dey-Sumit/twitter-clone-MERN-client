import TweetCard from "../components/TweetCard";
import Trends from "../components/Trends";
import { useRouter } from "next/router";
import React from "react";
import People from "components/People";
import Loader from "components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";
import CreateTweet from "components/CreateTweet";
import { useAuthState } from "context/auth.context";
import { FPaginatedPosts } from "libs/types";
import { usePaginatedPosts } from "libs/hooks";
// TODO error

export default function Home() {
  const { push } = useRouter();

  const { user } = useAuthState();
  const { error, posts, page, setPage, isReachingEnd } = usePaginatedPosts("/api/posts/feed");

  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      <div className="col-span-8 md:col-span-5">
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
            dataLength={posts.length} //This is important field to render the next data
            next={() => setPage(page + 1)}
            hasMore={!isReachingEnd}
            loader={<Loader />}
            endMessage={!error && <p className="customText-h3">No more posts</p>}
          >
            {posts?.map((tweet) => (
              <TweetCard tweet={tweet} key={tweet._id.toString()} />
            ))}
          </InfiniteScroll>
        )}
      </div>
      <div className="hidden col-span-8 space-y-4 md:col-span-3 md:block">
        <Trends noOfElements={5} />
        <People noOfElements={5} />
      </div>
    </div>
  );
}
