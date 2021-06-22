import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsImageFill } from "react-icons/bs";
import useSWR, { mutate } from "swr";

import Input from "@components/Input";
import { useAuthDispatch, useAuthState } from "@context/auth.context";

import Loader from "@components/Loader";
import Cookies from "js-cookie";
import { BiLoaderAlt } from "react-icons/bi";
import { User } from "@libs/types";

const profile: NextPage<{ user: User }> = ({ user }) => {
  const { push } = useRouter();
  const dispatch = useAuthDispatch();
  const [picture, setPicture] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isUpdating, setIsUpdating] = useState(false);

  const onChangePicture = (e: any) => {
    setPicture(URL.createObjectURL(e.target.files[0]));
  };

  //TODO validation using yup
  const onSubmit = async (data) => {
    if (isUpdating) return;
    setIsUpdating(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("bio", data.bio);
    if (data.profilePicture[0]) {
      formData.append("profilePicture", data.profilePicture[0]);
    }

    const { data: updatedUser } = await axios(`/api/users/${user._id}`, {
      method: "PUT",
      data: formData,
    });

    mutate(`/api/users/${user._id}`);

    setIsUpdating(false);

    // update the user and the cookie
    dispatch({
      type: "SET_USER", // change name of the type
      payload: updatedUser,
    });
    Cookies.set("user", updatedUser);
    push(`/user/${user._id}`);
  };

  // TODO looks like you don't have a profile :) show funny image ; don't redirect
  return (
    <div className="grid grid-cols-8 gap-8 ">
      <div className="col-span-12 p-2">
        <form
          className="flex flex-col w-full mx-auto mt-5 space-y-3 md:w-6/12"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="textCustom-h3">Edit Profile</h1>

          <div className="relative">
            <img
              src={picture || user?.profilePicture}
              alt="profile picture"
              className="w-40 h-40 mx-auto border rounded-full cursor-pointer border-3 inset-1/2"
            />

            <label htmlFor="file-input">
              <BsImageFill
                size="20"
                className="absolute w-10 h-10 transform -translate-x-1/2 -translate-y-1/2 border inset-1/2 "
              />
            </label>
            <input
              id="file-input"
              {...register("profilePicture")}
              onChange={onChangePicture}
              type="file"
              name="profilePicture"
              className="hidden"
            />
          </div>
          <div className="flex flex-col space-y-3 ">
            <Input
              register={register}
              fieldName="name"
              label="Name"
              defaultValue={user?.name}
              placeholder="name"
              error={errors.name}
            />
            <Input
              register={register}
              fieldName="bio"
              label="Bio"
              defaultValue={user?.bio}
              placeholder="bio"
              error={errors.name}
            />
            <Input
              register={register}
              fieldName="username"
              label="Username"
              defaultValue={user?.username}
              placeholder="username"
              error={errors.username}
            />
          </div>
          {/* uploadImage */}

          <button type="submit" className="button hover:bg-transparent hover:text-blue-600">
            {isUpdating ? (
              <>
                <BiLoaderAlt className="mr-2 animate-spin" /> Updating
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default profile;
// TODO make this function reusable
export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const cookie = context.req.headers.cookie;

    if (!cookie) throw new Error("Missing auth token cookie");

    // it returns 401 if the user is not authenticated
    const { data: user } = await axios.get(`${process.env.API_BASE_ENDPOINT}/api/auth/me`, {
      headers: { cookie },
      withCredentials: true,
    });

    return { props: { user } };
  } catch (error) {
    // console.log({ Error: error.message });

    return {
      redirect: {
        destination: "/auth",
        statusCode: 302,
      },
    };
  }
}
