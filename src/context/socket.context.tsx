import { useSnackbar } from "notistack";
import React, { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import useSWR from "swr";
import { useAuthState } from "./auth.context";

const SocketContext = createContext<Socket>(null);
export const SocketProvider = ({ children }) => {
  const { user } = useAuthState();
  const { mutate: unreadNotificationMutate } = useSWR(user && "/api/notifications?unreadOnly", {
    revalidateOnMount: false,
  });
  const { mutate: allNotificationMutate } = useSWR(user && "/api/notifications", {
    revalidateOnMount: false,
  });

  const { enqueueSnackbar } = useSnackbar();
  const [socket, setSocket] = useState<Socket>(null);

  useEffect(() => {
    if (user && socket && !socket.connected) {
      setSocket(socket.connect());
      return;
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
      });
    }

    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    };
    //eslint-disable-next-line
  }, [user, socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
