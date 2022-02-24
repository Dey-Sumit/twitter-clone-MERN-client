import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import cookie from "js-cookie";
import { BiLoaderAlt } from "react-icons/bi";
import { yupResolver } from "@hookform/resolvers/yup";

import Input from "@components/Input";
import { useAuthDispatch } from "@context/auth.context";
import { signupSchema } from "@libs/schemaValidation";
import { loginSchema } from "@libs/schemaValidation";

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(isLogin ? loginSchema : signupSchema),
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useAuthDispatch();

  const handleAuth = async (data: any) => {
    const url = isLogin ? "/api/auth/login" : "/api/auth/signup";

    try {
      setLoading(true);
      const res = await axios({
        method: "POST",
        url,
        data,
        // withCredentials: true,
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
    <div className="w-full p-2 mx-auto space-y-4 md:max-w-max">
      <form className="flex flex-col space-y-3" onSubmit={handleSubmit(handleAuth)}>
        <div className="space-y-3 md:space-y-0 md:flex md:space-x-4 md:items-center">
          {!isLogin && <Input label="Name" type="text" register={register} fieldName="name" error={errors.name} />}
          <Input
            label="Username"
            type="text"
            placeholder="Hi, Twitty"
            register={register}
            fieldName="username"
            error={errors.username}
          />
        </div>
        {!isLogin && <Input label="Email" type="email" fieldName="email" error={errors.email} register={register} />}
        <Input
          label="Password"
          type="password"
          placeholder="6+ Characters"
          fieldName="password"
          error={errors.password}
          register={register}
        />

        <button className="button" type="submit">
          {loading ? <BiLoaderAlt className="mr-2 animate-spin" /> : isLogin ? "Log in" : "Sign up"}
        </button>
      </form>

      {isLogin && (
        <p className="w-full p-1 mt-2 text-lg text-center rounded-xl bg-yellow-100 border-yellow-600 text-yellow-600 border ">
          Dummy Data
          <br /> username : koder {" | "}password : 123456
        </p>
      )}

      <p className="p-1 text-center text-red-600 ">{errorMessage}</p>

      <p className="text-lg tracking-wide text-center text-white border border-dark-400 px-6 py-2 rounded-full">
        {!isLogin ? "Already a member?" : "Don't have an account yet?"}
        <button className="cursor-pointer pl-2" onClick={() => setIsLogin(!isLogin)}>
          {!isLogin ? " Sign In" : " Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default AuthComponent;
