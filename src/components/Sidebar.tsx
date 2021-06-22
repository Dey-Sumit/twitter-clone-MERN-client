import { IoMdHome, IoMdLogOut } from "react-icons/io";
import { MdExplore } from "react-icons/md";
import { SiTwitter } from "react-icons/si";
import Link from "next/link";
import { useAuthDispatch, useAuthState } from "@context/auth.context";
import { useRouter } from "next/router";
import axios from "axios";

import { AiOutlineUser } from "react-icons/ai";
import { useLayoutDispatch, useLayoutState } from "@context/layout.context";
import { FunctionComponent, MouseEventHandler } from "react";
import { IconType } from "react-icons";
import Cookies from "js-cookie";

const SidebarItem: FunctionComponent<{
  Icon: IconType;
  text: string;
  handler?: MouseEventHandler<HTMLDivElement>;
}> = ({ Icon, text, handler }) => {
  return (
    <div className="navItem" onClick={handler}>
      <Icon size="25" className="flex-shrink-0" />
      <span className="hidden lg:block">{text}</span>
    </div>
  );
};

const Sidebar = () => {
  const layoutDispatch = useLayoutDispatch();
  const authDispatch = useAuthDispatch();
  const { user } = useAuthState();
  const { showNavbar } = useLayoutState();

  const router = useRouter();

  const showModal = async () => {
    layoutDispatch({
      type: "SHOW_CONFIRMATION_MODAL",
      payload: {
        subTitle: "Great!!! Focus on your real life",
        handleConfirmation: handleLogout,
        buttonText: "Log out",
      },
    });
  };
  const handleLogout = async (e: any) => {
    e.stopPropagation();
    authDispatch({ type: "REMOVE_USER" }); // ?NOT NEEDED I guess
    router.push("/auth");
    Cookies.remove("user");
    await axios.post("/api/auth/logout");
    layoutDispatch({
      type: "HIDE_CONFIRMATION_MODAL",
    });
  };

  return (
    <>
      <div
        className={`bg-dark-700 fixed flex-col justify-between h-screen px-3 sm:px-6 py-8 pb-20 text-lg shadow-lg flex z-10 sm:sticky top-0 sm:w-40  max-w-max transform transition-all duration-300 ${
          showNavbar ? "  translate-x-0" : "  -translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-center space-x-2 font-medium ">
          <Link href="/">
            <a>
              <SiTwitter
                className="text-blue-600 cursor-pointer "
                size="28"
                onClick={() => layoutDispatch({ type: "TOGGLE_NAVBAR" })}
              />
            </a>
          </Link>
        </div>
        <div
          className="flex flex-col space-y-5 "
          onClick={(e) => {
            e.stopPropagation();
            layoutDispatch({ type: "TOGGLE_NAVBAR" });
          }}
        >
          <SidebarItem Icon={IoMdHome} text="Home" handler={() => router.push("/")} />
          {user && (
            <SidebarItem
              Icon={AiOutlineUser}
              text="Profile"
              handler={() => router.push(`/user/${user._id}`)}
            />
          )}
          <SidebarItem Icon={MdExplore} text="Explore" handler={() => router.push("/explore")} />
          {/* <SidebarItem Icon={MdNotifications} text="Notifications" /> */}

          {user && <SidebarItem Icon={IoMdLogOut} text="LogOut" handler={showModal} />}
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Sidebar;
