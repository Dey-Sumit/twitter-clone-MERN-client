import { object, string } from "yup";

export const signupSchema = object().shape({
  username: string()
    .required("Username is Required")
    .min(4, "Username length must be at least 4")
    .matches(/^\w+$/, "no special characters are allowed for username"),
  name: string().required("Name is Required"),
  email: string().required("Email is required").email("Email is not valid"),
  password: string().required("Password is required").min(6, "Password Length must be at least 6"),
});
export const profileSchema = object().shape({
  username: string()
    .required("Username is Required")
    .min(4, "Username length must be at least 4")
    .matches(/^\w+$/, "no special characters are allowed for username"),
  name: string().required("Name is Required"),
  bio: string().max(50, "Give a shorter bio"),
});

export const loginSchema = object().shape({
  username: string()
    .required("Username is Required")
    .min(4, "Username length must be at least 4")
    .matches(/^\w+$/, "no special characters are allowed for username"),

  password: string().required("Password is required").min(6, "Password Length must be at least 6"),
});
