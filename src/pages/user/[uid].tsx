import { useRouter } from "next/router";
import useSWR from "swr";
import InfiniteScroll from "react-infinite-scroll-component";
import { useState } from "react";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import axios from "axios";

import TweetCard from "@components/TweetCard";
import Loader from "@components/Loader";
import { usePaginatedPosts } from "@libs/hooks";
import { User } from "@libs/types";
import UserCard from "@components/UserCard";
import ProfileCard from "@components/ProfileCard";
import Error from "@components/Error";
import { useAuthState } from "@context/auth.context";
import { useLayoutDispatch } from "@context/layout.context";

const Profile = (props) => {
  const { user: profileData } = props;
  const {
    isFallback,
    query: { uid },
  } = useRouter();
  // const profileDataError = false;

  // if (isFallback) {
  // }
  // const { data: profileData, error: profileDataError } = useSWR<User>(
  //   uid ? `/api/users/${uid}` : null
  // );

  const [currentTab, setCurrentTab] = useState("posts");
  const { user } = useAuthState();
  const dispatch = useLayoutDispatch();

  const handleTabChange = (value) => {
    if (!user) {
      dispatch({
        type: "SHOW_AUTH_MODAL",
      });
      return;
    }
    setCurrentTab(value);
  };
  const {
    paginatedData: posts,
    page,
    setPage,
    isValidating,
    isReachedEnd,
  } = usePaginatedPosts(uid ? `/api/posts?uid=${uid}` : null);

  const { data: following } = useSWR<User[]>(uid ? `/api/users/${uid}/followings` : null);

  const { data: followers } = useSWR<User[]>(uid ? `/api/users/${uid}/followers` : null);

  // TODO looks like you don't have a profile :) show funny image ; don't redirect
  return (
    <div className="grid gap-8 md:grid-cols-8 ">
      <div className="col-span-8 lg:col-span-3">
        {/* profile */}
        {!isFallback && !profileData && <Error text="Server Error on Profile  Data" />}
        {!isFallback ? <ProfileCard profileData={profileData} /> : <Loader />}
      </div>
      <div className="col-span-8 rounded-sm lg:col-span-5 bg-dark-500">
        <div className="flex px-4 py-2 space-x-4 shadow-lg ">
          <span
            className={`${currentTab === "posts" ? "text-blue-600 " : ""} cursor-pointer`}
            onClick={() => handleTabChange("posts")}
          >
            Tweets
          </span>
          <span
            className={`${currentTab === "followers" ? "text-blue-600 " : ""} cursor-pointer`}
            onClick={() => handleTabChange("followers")}
          >
            Followers
          </span>
          <span
            className={`${currentTab === "following" ? "text-blue-600 " : ""} cursor-pointer`}
            onClick={() => handleTabChange("following")}
          >
            Followings
          </span>
        </div>
        <div id="scrollableDiv" className="max-h-screen p-2 overflow-y-auto">
          {currentTab === "posts" &&
            (posts?.length === 0 ? (
              <h3 className="customText-h3">no post in this profile </h3>
            ) : (
              <InfiniteScroll
                dataLength={posts.length} //This is important field to render the next data
                next={() => setPage(page + 1)}
                hasMore={!isReachedEnd}
                loader={isValidating && <Loader />}
                endMessage={<p className="customText-h3">No More Posts</p>}
                scrollableTarget="scrollableDiv"
              >
                {posts?.map((tweet, i) => (
                  <TweetCard tweet={tweet} key={i} />
                ))}
              </InfiniteScroll>
            ))}

          {currentTab === "followers" &&
            (!followers ? (
              <Loader />
            ) : followers.length === 0 ? (
              <h1 className="customText-h3">You don't have any followers</h1>
            ) : (
              followers.map((user) => <UserCard user={user} showFollowButton={true} key={user._id} />)
            ))}

          {currentTab === "following" &&
            (!following ? (
              <Loader />
            ) : following.length === 0 ? (
              <h1 className="customText-h3">You are not following anyone</h1>
            ) : (
              following.map((user) => <UserCard user={user} showFollowButton={true} key={user._id} />)
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  const uid = ctx.params.uid;
  try {
    const { data: user } = await axios.get(`${process.env.API_BASE_ENDPOINT}/api/users/${uid}`);

    return {
      props: { user },
      revalidate: 100,
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        statusCode: 302,
      },
    };
  }
};
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    fallback: true,
    paths: [],
  };
};
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   // const cookie = context.req.headers?.cookie;
//   // console.log("inside");
//   try {
//     const cookie = context.req.headers.cookie;
//     if (!cookie) throw new Error("Missing auth token cookie");
//     // const res = await axios.get("/api/auth/me/");

//     // it returns 401 if the user is not authenticated
//     const { data: user } = await axios.get(
//       `${process.env.API_BASE_ENDPOINT}/api/auth/me`,
//       {
//         headers: { cookie },
//       }
//     );

//     return {
//       props: {
//         sameUser: user._id == context.query.uid,
//       },
//     };
//   } catch (error) {
//     return {
//       redirect: {
//         destination: "/auth",
//         statusCode: 302,
//       },
//     };
//   }
// }
