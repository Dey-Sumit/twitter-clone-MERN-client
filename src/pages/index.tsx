import TweetCard from "@components/TweetCard";
import CreateTweet from "@components/CreateTweet";
import Loader from "@components/Loader";
import { useAuthState } from "@context/auth.context";
import { usePaginatedPosts } from "@libs/hooks";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import NewOnTwitter from "@components/NewOnTwitter";
import Trends from "@components/Trends";
import People from "@components/People";
export default function Home() {
  const { user } = useAuthState();
  const {
    error,
    paginatedData: posts,
    page,
    setPage,
    isValidating,
    isReachedEnd,
  } = usePaginatedPosts("/api/posts/feed");

  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      <div className="col-span-8 md:col-span-5">
        <div className="h-[90vh] overflow-y-auto" id="scrollableDiv">
          {user ? <CreateTweet /> : <NewOnTwitter />}

          {user?.following.length === 0 && <h3 className="customText-h3">Tweets You might like!</h3>}

          <InfiniteScroll
            dataLength={posts?.length}
            next={() => setPage(page + 1)}
            hasMore={!isReachedEnd}
            scrollableTarget="scrollableDiv"
            loader={isValidating && <Loader />}
            endMessage={!error && <p className="customText-h3 -mt-1">No more posts</p>}
          >
            {posts?.map((tweet) => (
              <TweetCard tweet={tweet} key={tweet._id.toString()} />
            ))}
          </InfiniteScroll>
        </div>
      </div>
      <div className="hidden col-span-8 py-4 space-y-4 md:col-span-3 md:block">
        <Trends noOfElements={5} />
        <People noOfElements={5} />
      </div>
    </div>
  );
}
