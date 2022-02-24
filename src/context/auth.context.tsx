import axios from "axios";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { User } from "@libs/types";

import Cookies from "js-cookie";
interface IState {
  user: User;
  loading?: boolean; // might be needed later
}

interface IAction {
  type: "REMOVE_USER" | "SET_USER" | "STOP_LOADING";
  payload?: User;
}
// create two context; one for the state and one for the dispatch
const StateContext = createContext<IState>(undefined); //create context default value only useful for testing
//https://stackoverflow.com/questions/49949099/react-createcontext-point-of-defaultvalue

const DispatchContext = createContext<React.Dispatch<IAction>>(null);

const reducer = (state: IState, { type, payload }: IAction) => {
  switch (type) {
    case "SET_USER":
      return {
        ...state,
        user: payload,
      };

    case "REMOVE_USER":
      Cookies.remove("user");
      return {
        ...state,
        user: null,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type ${type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<IState, IAction>>(reducer, {
    user: null,
    loading: true, // might be needed later :(
  });

  useEffect(() => {
    async function loadUser() {
      try {
        // set initially from cookie
        /*  dispatch({
          type: "SET_USER",
          payload: Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
        }); */
        const res = await axios.get("/api/auth/me");

        dispatch({
          type: "SET_USER",
          payload: res.data,
        });
        Cookies.set("user", res.data);
      } catch (error) {
        console.log(error.message);
        Cookies.remove("user");
        dispatch({
          type: "REMOVE_USER",
        });
      } finally {
        dispatch({
          type: "STOP_LOADING",
        });
      }
    }
    loadUser();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
