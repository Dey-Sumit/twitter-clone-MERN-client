import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
const TweetSkeleton = () => {
  return (
    <SkeletonTheme color="#374151" highlightColor="#3c4147">
      <div className="flex mb-5 space-x-6">
        <Skeleton circle height={50} width={50} />

        <div className="w-full">
          <Skeleton height={30} width={300} />
          <Skeleton height={100} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default TweetSkeleton;
