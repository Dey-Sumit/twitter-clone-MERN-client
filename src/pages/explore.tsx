import People from "components/People";
import Trends from "components/Trends";

const Explore = () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-2 md:col-span-1">
        <Trends />
      </div>
      <div className="col-span-2 col md:col-span-1">
        <People />
      </div>
    </div>
  );
};

export default Explore;
