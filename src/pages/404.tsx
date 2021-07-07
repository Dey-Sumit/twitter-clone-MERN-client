import Image from "next/image";
import NotFound from "@public/notFound.svg";
const CustomNotFoundPage = () => {
  return (
    <div className="grid text-white place-items-center h-[85vh]">
      <Image alt="404" width={600} height={600} src={NotFound} />
    </div>
  );
};

export default CustomNotFoundPage;
