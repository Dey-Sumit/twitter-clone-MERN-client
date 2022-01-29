import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";
import { CreateComment, TweetCard, Trends, CommentCard } from "@components/index";
import { Post } from "@libs/types";
import Loader from "@components/Loader";
import { useAuthState } from "@context/auth.context";
import NewOnTwitter from "@components/NewOnTwitter";

const TweetPage = () => {
  const { user } = useAuthState();
  const router = useRouter();
  const { tid } = router.query;
  const { data, error } = useSWR<Post>(tid ? `/api/posts/${tid}` : null);

  if (error) {
    return <h3>Oops Error!!!</h3>;
  }
  return (
    <div className="grid grid-cols-8 gap-x-8 ">
      <Head>
        <title>{data?.content}</title>
      </Head>
      <div className="col-span-8 md:col-span-5">
        {/* Comment */}
        {!data ? (
          <Loader />
        ) : (
          <>
            <TweetCard tweet={data} />
            {user ? <CreateComment tid={tid?.toString()} tweetedBy={data.user._id} /> : <NewOnTwitter />}
            <div className="pl-14">
              {data.comments?.map((comment) => (
                <CommentCard key={comment._id} data={comment} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="hidden col-span-8 space-y-4 md:col-span-3 md:block">
        <Trends />
      </div>
    </div>
  );
};

export default TweetPage;
