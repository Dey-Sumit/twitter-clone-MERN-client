// import { FunctionComponent } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

// const TweetSkeleton = ({ key }) => {
//   return (
//     <SkeletonTheme color="#343a40" highlightColor="#3c4147" key={key}>
//       <div className="flex mb-5 space-x-6">
//         <Skeleton circle height={40} width={40} />

//         <div className="w-full">
//           <Skeleton height={30} />
//           <Skeleton height={80} />
//         </div>
//       </div>
//     </SkeletonTheme>
//   );
// };

// const PeopleSkeleton = ({ key }) => {
//   return (
//     <SkeletonTheme color="#343a40" highlightColor="#3c4147">
//       <div className="flex mb-5 space-x-6">
//         <Skeleton circle height={40} width={40} />

//         <div className="w-full">
//           <Skeleton height={40} />
//         </div>
//       </div>
//     </SkeletonTheme>
//   );
// };

// const CustomSkeleton: FunctionComponent<{ count: number; type: "tweet" | "hashtag" | "people" }> =
//   ({ count, type }) => {
//     return (
//       <>
//         {[...Array(count)].map((_, i) => (

//          type === "tweet" &&<TweetSkeleton key={i} />
//          type === "people" &&<PeopleSkeleton key={i} />

//         ))}
//       </>
//     );
//   };

// export default CustomSkeleton;

const NotificationSkeleton = () => {
  return (
    <SkeletonTheme color="#374151" highlightColor="#3c4147">
      <div className="flex mb-5 space-x-6">
        <Skeleton circle height={40} width={40} />
        
        <Skeleton circle height={40} width={40} />

        <div className="w-full">
          <Skeleton height={40} />
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default NotificationSkeleton;
