import { useSnackbar } from "notistack";
import React, { createContext, Dispatch, useContext, useEffect, useReducer, useState } from "react";
import io, { Socket } from "socket.io-client";
import useSWR from "swr";
import { useAuthState } from "./auth.context";

const SocketContext = createContext<Socket>(null);
export const SocketProvider = ({ children }) => {
  const { mutate: unreadNotificationMutate } = useSWR("/api/notifications?unreadOnly", {
    revalidateOnMount: false,
  });
  const { mutate: allNotificationMutate } = useSWR("/api/notifications", {
    revalidateOnMount: false,
  });

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { user } = useAuthState();
  const [socket, setSocket] = useState<Socket>(null);

  useEffect(() => {
    if (socket && !socket.connected) {
      const x = socket.connect();
      setSocket(x);
    }
    if (user && !socket) {
      const temp_socket = io(process.env.NEXT_PUBLIC_API_BASE_ENDPOINT, {
        query: {
          userId: user._id,
        },
      });
      setSocket(temp_socket);

      temp_socket.on("NOTIFY_TO_CLIENT", (data) => {
        enqueueSnackbar(data.message, {
          preventDuplicate: true,
        });
        unreadNotificationMutate();
        allNotificationMutate();

        //console.log("notify received", temp_socket.id, data);
      });
    }

    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    };
  }, [user]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
