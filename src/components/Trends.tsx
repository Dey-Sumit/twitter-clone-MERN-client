import useSWR from "swr";
import { Tag } from "@libs/types";
import { FunctionComponent } from "react";
import TagCard from "./TagCard";
import HashtagSkeleton from "./skeletons/HashTagSkeleton";

const Trends: FunctionComponent<{ noOfElements?: number }> = ({ noOfElements = 10 }) => {
  const { data: tags, error } = useSWR<Tag[]>("/api/tags");

  return (
    <div className="flex flex-col p-2 space-y-3 divide-y shadow-sm rounded-2xl bg-dark-600 divide-dark-500">
      <h3 className="px-3 py-1 text-xl font-bold text-white">Trends For You</h3>
      {error && <h3 className="customText-h3">Could not load , Retrying</h3>}

      {tags ? (
        tags.slice(0, noOfElements).map((tag, i) => <TagCard tag={tag} key={tag._id.toString()} />)
      ) : (
        <div>
          {[...Array(3)].map((_, i) => (
            <HashtagSkeleton key={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trends;
