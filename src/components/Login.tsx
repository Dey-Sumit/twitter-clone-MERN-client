import axios from "axios";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import classNames from "classnames";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAuthDispatch } from "../context/auth.context";

import Input from "./Input";
import { loginSchema } from "@libs/schemaValidation";
import cookie from "js-cookie";
// interface loginData {
//   email?: string;
//   username?: string;
//   password: string;
// }

const Login: FunctionComponent<{
  large: Boolean;
}> = ({ large }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onTouched", // when to execute the validation first time
    resolver: yupResolver(loginSchema),
  });
  const { push } = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useAuthDispatch();

  const handleClick = async (data: any) => {
    try {
      setLoading(true);
      const res = await axios({
        method: "post",
        url: "/api/auth/login",
        data: data,
      });
      // 2. set the global state
      dispatch({
        type: "SET_USER",
        payload: res.data,
      });
      push("/");
      cookie.set("user", res.data);

      // 3. redirect to home page
    } catch (error) {
      if (error.response.status === 401) {
        setErrorMessage("Invalid credentials");
        return;
      }
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={classNames("flex flex-col space-y-4", {
        "w-10/12 md:w-6/12": large,
      })}
    >
      <h1 className="text-2xl font-bold text-white">Sign in to Twitty</h1>
      <form className="flex flex-col space-y-3" onSubmit={handleSubmit(handleClick)}>
        <Input
          label="Email"
          type="text"
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
        <button className="button">
          {!loading ? "Sign In" : <BiLoaderAlt className="mr-2 animate-spin" />}
        </button>
      </form>

      {errorMessage && (
        <div className="p-1 text-lg tracking-wide text-center text-red-600 border border-red-600">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
export default Login;

// 7,6mb tra
