import { Tag } from "@libs/types";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

const TagCard: FunctionComponent<{ tag: Tag }> = ({ tag: { name, length } }) => {
  const { push } = useRouter();

  return (
    <div className="flex flex-col px-3 pt-2 cursor-pointer" onClick={() => push(`/tags/${name}`)}>
      <span className="text-white">#{name}</span>
      <span>{length} Tweets</span>
    </div>
  );
};

export default TagCard;
