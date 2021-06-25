import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import { yupResolver } from "@hookform/resolvers/yup";
import cookie from "js-cookie";

import { signupSchema } from "@libs/schemaValidation";
import { useAuthDispatch } from "../context/auth.context";
import Input from "./Input";

export default function Register() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(signupSchema),
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useAuthDispatch();

  const handleClick = async (data: any) => {
    try {
      setLoading(true);
      const res = await axios({
        method: "POST",
        url: "/api/auth/signup",
        data: data,
      });

      dispatch({ type: "SET_USER", payload: res.data });
      router.push("/");
      cookie.set("user", res.data);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full p-2 space-y-4 md:max-w-max">
      <h1 className="text-2xl font-bold text-white">Sign up to Twitty</h1>

      <form className="flex flex-col space-y-3" onSubmit={handleSubmit(handleClick)}>
        {/* // wrapper of the form 👆*/}
        <div className="space-y-3 md:space-y-0 md:flex md:space-x-4 md:items-center">
          <Input
            label="Name"
            type="text"
            register={register}
            fieldName="name"
            error={errors.name}
          />
          <Input
            label="Username"
            type="text"
            register={register}
            fieldName="username"
            error={errors.username}
          />
        </div>
        <Input
          label="Email"
          type="email"
          fieldName="email"
          error={errors.email}
          register={register}
        />
        <Input
          label="Password"
          type="password"
          placeholder="6+ Characters"
          fieldName="password"
          error={errors.password}
          register={register}
        />

        <button className="flex items-center justify-center p-2 text-lg font-bold text-white bg-blue-700 rounded-md focus:outline-none">
          {!loading ? "Sign Up" : <BiLoaderAlt className="mr-2 animate-spin" />}
        </button>
      </form>

      {errorMessage && (
        <div className="p-1 text-center text-red-600 border border-red-600">{errorMessage}</div>
      )}
    </div>
  );
}
