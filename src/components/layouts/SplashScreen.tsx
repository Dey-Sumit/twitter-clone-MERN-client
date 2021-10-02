import Image from "next/image";

import logo from "@public/logo.svg";
const SplashScreen = () => {
  return (
    <div className="grid h-screen place-items-center z-[99] fixed bg-dark-700 inset-0">
      <Image src={logo} alt="logo" width={100} height={100} />
    </div>
  );
};

export default SplashScreen;
