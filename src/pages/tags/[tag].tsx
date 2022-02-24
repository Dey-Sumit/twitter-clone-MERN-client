import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

import Trends from "@components/Trends";
import TweetCard from "@components/TweetCard";
import { Post } from "@libs/types";
import TweetSkeleton from "@components/skeletons/TweetSkeleton";

interface IData {
  posts: Post[];
  name: string;
}
const TagPage = () => {
  const {
    query: { tag },
  } = useRouter();

  const { data } = useSWR<IData>(tag ? `/api/tags/${tag}` : null);

  if (data?.posts?.length === 0) {
    return <h3 className="textCustom-h3">{`There are no posts under ${tag}`}</h3>;
  }
  return (
    <div className="grid grid-cols-8 py-6 gap-x-8">
      {/* <div className="col-span-2">Sidebar</div> */}
      <Head>
        <title>Tweety/{tag}</title>
      </Head>
      <div className="col-span-8 md:col-span-5">
        {data?.posts ? (
          <>
            <div className="flex justify-between p-2 text-2xl font-semibold">
              <span>#{tag}</span> <span> {data.posts.length} Tweets</span>{" "}
            </div>

            {data.posts.map((tweet) => (
              <TweetCard tweet={tweet} key={tweet._id} />
            ))}
          </>
        ) : (
          <div>
            {[...Array(5)].map((_, i) => (
              <TweetSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
      <div className="col-span-8 md:col-span-3">
        <Trends />
      </div>
    </div>
  );
};

//! 👇 server side rendering
/* export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { tag } = ctx.query;

  let posts;
  try {
    const { data } = await axios.get(
      `${process.env.API_BASE_ENDPOINT}/api/tags/${tag}`
    );

    posts = data.posts;

    if (!posts) {
      posts = [];
    }
    posts = JSON.parse(JSON.stringify(posts));
  } catch (error) {
    posts = [];
  }

  return {
    props: {
      data: { posts, name: tag },
    },
  };
}; */

//! 👆 you can use ISR here , cause if some people see the tweets after some delay,that's not an issue at all in 1 million user's webapp

/* export async function getStaticPaths() {
  return { paths: [], fallback: true };
}
export async function getStaticProps(ctx: GetStaticPropsContext) {
  const { tag } = ctx.params;

  let posts: any;
  try {
    const { data } = await axios.get(`${process.env.API_BASE_ENDPOINT}/api/tags/${tag}`);

    posts = data?.posts ?? [];
  } catch (error) {
    posts = [];
  }

  return {
    props: {
      posts,
    },
    revalidate: 10,
  };
} */

export default TagPage;
