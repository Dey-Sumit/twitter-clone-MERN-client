import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
const HashtagSkeleton = () => {
  return (
    <SkeletonTheme color="#374151" highlightColor="#3c4147">
      <div className="flex mb-5 space-x-6">
        <Skeleton circle height={40} width={40} />

        <div className="w-full">
          <Skeleton height={40} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default HashtagSkeleton;
