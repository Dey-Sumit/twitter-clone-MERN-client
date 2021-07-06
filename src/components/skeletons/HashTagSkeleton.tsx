import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
const HashtagSkeleton = () => {
  return (
    <SkeletonTheme color="#374151" highlightColor="#3c4147">
      <div className="w-full mb-5">
        <Skeleton height={20} width={150} />
        <Skeleton height={40} />
      </div>
    </SkeletonTheme>
  );
};

export default HashtagSkeleton;
