import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import Trends from "components/Trends";
import TweetCard from "components/TweetCard";
import { FPost } from "libs/types";
import useSWR from "swr";
import { useRouter } from "next/router";
import Loader from "components/Loader";
interface IData {
  posts: FPost[];
  name: string;
}
const index = () => {
  const {
    query: { tag },
  } = useRouter();

  const { data } = useSWR<IData>(tag ? `/api/tags/${tag}` : null);
  if (data?.posts.length === 0) {
    return <h3 className="textCustom-h3">{`There are no posts under ${tag}`}</h3>;
  }
  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      {/* <div className="col-span-2">Sidebar</div> */}
      <Head>
        <title>{tag}</title>
      </Head>
      <div className="col-span-8 md:col-span-5">
        {data?.posts ? (
          <>
            <div className="flex justify-between p-2 text-2xl font-semibold">
              <span>#{tag}</span> <span> {data?.posts.length} Tweets</span>{" "}
            </div>
            {/* // TODO tweet or post? :( */}
            {data?.posts.map((tweet) => (
              <TweetCard tweet={tweet} key={tweet._id} />
            ))}
          </>
        ) : (
          <Loader />
        )}
      </div>
      <div className="col-span-8 md:col-span-3">
        <Trends />
      </div>
    </div>
  );
};

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   const { tag } = ctx.query;

//   // TODO check if relative URL works or not in axios server side
//   // TODO make this client side, no point of making this server side
//   let posts;
//   try {
//     const { data } = await axios.get(
//       `${process.env.API_BASE_ENDPOINT}/api/tags/${tag}`
//     );

//     posts = data.posts;

//     if (!posts) {
//       posts = [];
//     }
//     posts = JSON.parse(JSON.stringify(posts));
//   } catch (error) {
//     posts = [];
//   }

//   return {
//     props: {
//       data: { posts, name: tag },
//     },
//   };
// };

export default index;
