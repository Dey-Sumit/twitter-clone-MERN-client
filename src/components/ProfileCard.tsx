import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { FunctionComponent, MouseEvent, useEffect, useState } from "react";
import { MdDelete, MdSettings } from "react-icons/md";
import { mutate } from "swr";
import { useAuthDispatch, useAuthState } from "@context/auth.context";
import { User } from "@libs/types";
import Head from "next/head";
import Loader from "@components/Loader";
import Image from "next/image";
import { useLayoutDispatch } from "@context/layout.context";

import Cookies from "js-cookie";
import { useSocket } from "@context/socket.context";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { sweetAlertOptions } from "@libs/sweetAlert";
import { SiTwitter } from "react-icons/si";
const MySwal = withReactContent(Swal);

const ProfileCard: FunctionComponent<{ profileData: User }> = ({ profileData }) => {
  const { push, query } = useRouter();

  const socket = useSocket();

  const layoutDispatch = useLayoutDispatch();
  const authDispatch = useAuthDispatch();
  const { user: authUser } = useAuthState();

  const [isFollowing, setIsFollowing] = useState<boolean>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const temp = authUser && profileData?.followers.includes(authUser._id);

    setIsFollowing(temp);
  }, [profileData, authUser]);

  const handleFollow = async (e: MouseEvent<any>) => {
    e.stopPropagation();
    if (!authUser) {
      layoutDispatch({
        type: "SHOW_AUTH_MODAL",
      });
      return;
    }
    if (loading) return;
    const ENDPOINT = `/api/users/${profileData._id}/follow`;
    try {
      setLoading(true);
      await axios.put(ENDPOINT);

      !isFollowing &&
        socket.emit("NOTIFY", {
          userTo: profileData._id,
          message: `${authUser.name} started following you`,
        });

      setIsFollowing((value) => !value);
      // update the followers and followings
      mutate(`/api/users/${authUser._id}/followings`);
      mutate(`/api/users/${authUser._id}/followers`);
      mutate(`/api/users/${authUser._id}`);
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    // try {
    MySwal.fire({
      title: (
        <div>
          <p className="mb-2 text-xl text-white">Delete Account?</p>
          <p className="mb-4 text-sm text-gray-200">Good! Do it for all the socials!</p>
        </div>
      ),
      ...sweetAlertOptions,
      iconHtml: <SiTwitter className="w-10 h-10 text-gray-200" />,
    }).then(async (data) => {
      if (data.isConfirmed) {
        authDispatch({ type: "REMOVE_USER" });
        await axios.delete(`/api/users/${profileData._id}`);
        Cookies.remove("user");
        socket.disconnect();
        push("/auth");
        await axios.delete("/api/auth/logout");
      }
    });
  };

  return (
    <>
      <Head>
        <title>Twitty | {profileData ? profileData.username : "Profile"}</title>
      </Head>
      <div className="flex flex-col items-center p-3 space-y-2 rounded-sm shadow-md bg-dark-600">
        {profileData ? (
          <>
            <Image
              width={112}
              height={112}
              src={profileData?.profilePicture}
              alt=""
              className="rounded-full w-28 h-28"
            />

            <h3 className="text-lg font-semibold">{profileData?.name}</h3>
            <h4>@{profileData?.username}</h4>
            <h4>{profileData?.bio}</h4>
            <div className="flex space-x-6 divide-x divide-dark-500">
              <div className="flex flex-col items-center pl-4">
                <span className="text-gray-400">Tweets</span>
                <span>{profileData?.noOPosts}</span>
              </div>
              <div className="flex flex-col items-center pl-4">
                <span className="text-gray-400">Followers</span>
                <span>{profileData?.noOfFollowers}</span>
              </div>
              <div className="flex flex-col items-center pl-4">
                <span className="text-gray-400">Following</span>
                <span>{profileData?.noOfFollowing}</span>
              </div>
            </div>
          </>
        ) : (
          <Loader />
        )}

        {query.uid && query.uid !== authUser?._id && (
          <button
            className="p-1 space-x-2 bg-blue-600 border border-blue-600 rounded-sm cursor-pointer hover:bg-transparent hover:text-blue-600"
            onClick={handleFollow}
          >
            {!isFollowing ? "Follow" : "UnFollow"}
          </button>
        )}
      </div>
      {profileData && authUser?._id === profileData?._id && (
        <div className="flex flex-col mt-2 space-y-2">
          <Link href="/user/edit">
            <a>
              <div className="flex items-center justify-center p-2 space-x-2 border rounded-sm cursor-pointer border-dark-400">
                <MdSettings /> <span>Edit Profile</span>
              </div>
            </a>
          </Link>

          <button
            className="flex items-center justify-center p-2 space-x-2 text-white bg-red-600 rounded-sm cursor-pointer"
            onClick={handleDeleteProfile}
          >
            <MdDelete /> <span> Delete Account </span>
          </button>
        </div>
      )}
    </>
  );
};

export default ProfileCard;
