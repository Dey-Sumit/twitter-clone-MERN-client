import { HiOutlineEmojiSad } from "react-icons/hi";

const Error = ({ text }) => {
  return (
    <h3 className="flex items-center justify-center customText-h3 ">
      <HiOutlineEmojiSad className="mr-3 text-lg" /> {text}
    </h3>
  );
};

export default Error;
