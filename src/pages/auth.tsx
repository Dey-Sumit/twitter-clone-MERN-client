import Image from "next/image";

import heroImage from "@public/image_3d.png";
import logo from "@public/logo.svg";
import AuthComponent from "@components/AuthComponent";

export default function Auth() {
  return (
    <div className="grid h-screen grid-cols-8 text-white">
      {/* left part */}
      <div className="hidden col-span-3 p-4 bg-blue-700 md:grid place-items-center">
        <h1 className="mb-5 text-3xl font-semibold text-center">
          Tweety helps you to focus more on social life than your real life!{" "}
        </h1>
        <div className="w-full h-full ">
          <Image placeholder="blur" layout="responsive" src={heroImage} alt="" />
        </div>
      </div>

      {/* right part */}
      <div className="grid col-span-8 p-2 bg-dark-700 md:col-span-5 place-items-center">
        <div className="flex flex-col justify-center space-y-8">
          {/* <div className="flex flex-col justify-center space-y-10 "> */}
          <Image src={logo} width={40} height={40} alt="logo" />
          <h3 className="mb-10 text-lg md:text-2xl">Come on! Let's waste time on Social Media</h3>
          {/* </div> */}
          <AuthComponent />
        </div>
      </div>
    </div>
  );
}
