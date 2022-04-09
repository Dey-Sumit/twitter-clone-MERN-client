import axios from "axios";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsImageFill } from "react-icons/bs";
import { mutate } from "swr";
import Cookies from "js-cookie";

import Input from "@components/Input";
import { useAuthDispatch } from "@context/auth.context";
import { User } from "@libs/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { profileSchema } from "@libs/schemaValidation";

const EditProfile: NextPage<{ user: User }> = ({ user }) => {
  const { push } = useRouter();
  const dispatch = useAuthDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(profileSchema),
  });

  const [isUpdating, setIsUpdating] = useState(false);

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

  return (
    <div className="grid grid-cols-8 gap-8 py-4">
      <div className="col-span-12 p-2">
        <form className="flex flex-col w-full mx-auto mt-5 space-y-3 md:w-6/12" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="textCustom-h3">Edit Profile</h1>

          <div className="relative">
            {/* //! https://github.com/vercel/next.js/discussions/19732  */}
            {/* eslint-disable-next-line */}
            <img
              src={
                watch("profilePicture")?.[0] ? URL.createObjectURL(watch("profilePicture")?.[0]) : user?.profilePicture
              }
              alt="profile picture"
              className="w-40 h-40 mx-auto border rounded-full border-3 inset-1/2"
            />
            <label htmlFor="file-input">
              <BsImageFill
                size="20"
                className="absolute w-10 h-10 transform -translate-x-1/2 -translate-y-1/2 border cursor-pointer inset-1/2 "
              />
            </label>
            <Input id="file-input" register={register} fieldName="profilePicture" type="file" />
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
              placeholder="All this time, I thought I wanted a job. Turns out, I just wanted a paycheck"
              error={errors.bio}
              isTypedTextarea
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
          <button type="submit" className="border border-blue-600 button hover:bg-transparent hover:text-blue-600">
            {isUpdating ? "Updating" : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
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
