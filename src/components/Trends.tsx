import useSWR from "swr";
import { FTag } from "@libs/types";
import { FunctionComponent } from "react";
import Loader from "./Loader";
import TagCard from "./TagCard";

const Trends: FunctionComponent<{ noOfElements?: number }> = ({ noOfElements = 10 }) => {
  const { data: tags, error } = useSWR<FTag[]>("/api/tags");

  return (
    <div className="flex flex-col p-2 space-y-3 divide-y shadow-sm rounded-2xl bg-dark-600 divide-dark-500">
      <h3 className="px-3 py-1 text-xl font-bold text-white">Trends For You</h3>
      {error && !tags && <h3 className="customText-h3">Could not load</h3>}

      {tags ? (
        tags.slice(0, noOfElements).map((tag, i) => <TagCard tag={tag} key={tag._id.toString()} />)
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Trends;
