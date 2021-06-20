import { NextApiRequest } from "next";
import { User } from "./types";

export interface ExtendedRequest extends NextApiRequest {
  session: {};
  user: User;
  file: {
    filename: string;
    path: string;
  };
  logOut: Function;
  login: Function;
}
