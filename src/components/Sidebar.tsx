import { IoMdHome, IoMdLogOut, IoMdNotifications } from "react-icons/io";
import { MdExplore } from "react-icons/md";
import { SiTwitter } from "react-icons/si";
import Link from "next/link";
import { useAuthDispatch, useAuthState } from "@context/auth.context";
import { useRouter } from "next/router";
import axios from "axios";

import { useLayoutDispatch, useLayoutState } from "@context/layout.context";
import { FunctionComponent, MouseEventHandler } from "react";
import { IconType } from "react-icons";

import useSWR from "swr";
import { RiUserFill } from "react-icons/ri";
import { useSocket } from "@context/socket.context";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { sweetAlertOptions } from "@libs/sweetAlert";
import { FaGithubAlt } from "react-icons/fa";
const MySwal = withReactContent(Swal);

const SidebarItem: FunctionComponent<{
  Icon: IconType;
  text: string;
  type?: string;
  badgeData?: number;
  handler?: MouseEventHandler<HTMLDivElement>;
}> = ({ Icon, badgeData, text, handler, type }) => {
  return (
    <div className="navItem" onClick={handler}>
      <div className="relative ">
        <Icon size="30" className="flex-shrink-0" />
        {type === "badge" && badgeData > 0 && (
          <span className="absolute grid w-5 h-5 text-xs text-white bg-blue-600 rounded-full -bottom-1 -right-1 place-items-center">
            {badgeData > 9 ? "9+" : badgeData}
          </span>
        )}
      </div>
      <span className="hidden tracking-wide lg:block">{text}</span>
    </div>
  );
};

const Sidebar = () => {
  const layoutDispatch = useLayoutDispatch();
  const authDispatch = useAuthDispatch();
  const { user } = useAuthState();
  const { showNavbar } = useLayoutState();
  const socket = useSocket();
  const router = useRouter();

  const handleLogout = async (e: any) => {
    MySwal.fire({
      title: (
        <div>
          <p className="mb-2 text-xl text-white">Are You Sure?</p>
          <p className="mb-4 text-sm text-gray-200">Good! Focus on Real Life</p>
        </div>
      ),
      ...sweetAlertOptions,
      iconHtml: <SiTwitter className="w-10 h-10 text-gray-200" />,
    }).then(async (data) => {
      if (data.isConfirmed) {
        authDispatch({ type: "REMOVE_USER" });
        socket.disconnect();
        router.push("/auth");
        await axios.delete("/api/auth/logout");
      }
    });
  };

  // const getNotifications = () => {};
  const { data: notifications } = useSWR(user && "/api/notifications?unreadOnly");

  return (
    <div
      className={`bg-dark-700 fixed flex-col justify-between h-screen px-3 sm:px-6 py-8 pb-20 text-lg shadow-lg flex z-10 sm:sticky top-0 sm:max-w-max  max-w-max transform transition-all duration-300 ${
        showNavbar ? "  translate-x-0" : "  -translate-x-full sm:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-center space-x-2 font-medium ">
        <Link href="/">
          <a>
            <SiTwitter
              className="text-blue-600 cursor-pointer "
              size="30"
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
        {user && <SidebarItem Icon={RiUserFill} text="Profile" handler={() => router.push(`/user/${user._id}`)} />}
        {user && (
          <SidebarItem
            type="badge"
            badgeData={notifications?.length}
            Icon={IoMdNotifications}
            text="Notis"
            handler={() => router.push("/notifications/")}
          />
        )}
        <SidebarItem Icon={MdExplore} text="Explore" handler={() => router.push("/explore")} />

        <SidebarItem
          Icon={FaGithubAlt}
          text="GitHub"
          handler={() => window.open("https://github.com/Dey-Sumit/twitter-clone-MERN-client", "_blank")}
        />

        {user && <SidebarItem Icon={IoMdLogOut} text="LogOut" handler={handleLogout} />}
      </div>
      <div></div>
    </div>
  );
};

export default Sidebar;
