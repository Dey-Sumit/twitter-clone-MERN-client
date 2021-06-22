import Image from "next/image";

import heroImage from "@public/image_3d.png";
import AuthComponent from "@components/AuthComponent";

export default function Auth() {
  return (
    <div className="grid h-screen grid-cols-8 text-white">
      {/* left part */}
      <div className="hidden col-span-3 p-4 bg-blue-700 md:grid place-items-center">
        <h1 className="mb-5 text-3xl font-semibold">
          Tweety helps you connect and share with the people in your life.{" "}
        </h1>
        <div className="w-full h-full ">
          <Image placeholder="blur" layout="responsive" src={heroImage} />
        </div>
      </div>

      {/* right part */}
      <div className="grid col-span-8 p-2 bg-dark-700 md:col-span-5 place-items-center">
        <div>
          <h3 className="mb-10 text-2xl">Come on! Let's waste time on Social Media</h3>
          <AuthComponent />
        </div>
      </div>
    </div>
  );
}
