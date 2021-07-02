import { useSnackbar } from "notistack";
import React, { createContext, Dispatch, useContext, useEffect, useReducer, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useAuthState } from "./auth.context";

// if (socket.connected) console.log(socket.id);
// socket.on("SET_UP_COMPLETE", () => {
//   console.log("SET_UP_COMPLETE");
//   // dispatch({ type: "SOCKET_CONNECTED" });
// });

// console.log(socket.connected);
// socket.on("connect", () => {
//   console.log(socket.connected);
//   console.log(" connect");
// });
// interface Context {
//   socket?: Socket;
// }

//create context default value only useful for testing
//https://stackoverflow.com/questions/49949099/react-createcontext-point-of-defaultvalue

const SocketContext = createContext<Socket>(null);
export const SocketProvider = ({ children }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { user } = useAuthState();
  const [socket, setSocket] = useState<Socket>(null);

  useEffect(() => {
    if (socket && !socket.connected) {
      const x = socket.connect();
      setSocket(x);
    }
    if (user && !socket) {
      const temp_socket = io("http://localhost:4000", {
        query: {
          userId: user._id,
        },
      });
      setSocket(temp_socket);

      temp_socket.on("NOTIFY_TO_CLIENT", (data) => {
        enqueueSnackbar(data.message, {
          preventDuplicate: true,
        });

        //console.log("notify received", temp_socket.id, data);
      });
    }

    return () => {
      if (socket) {
        console.log("socket close");

        socket.close();
        setSocket(null);
      }
    };
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
