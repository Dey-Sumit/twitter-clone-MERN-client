import AuthComponent from "@components/AuthComponent";
import { useAuthState } from "@context/auth.context";
import { useLayoutDispatch, useLayoutState } from "@context/layout.context";
import { useEffect } from "react";

const AuthModal = () => {
  const { showAuthModal } = useLayoutState();
  const dispatch = useLayoutDispatch();
  const { user } = useAuthState();
  useEffect(() => {
    if (user)
      dispatch({
        type: "HIDE_AUTH_MODAL",
      });
  }, [user,dispatch]);
  return (
    <div
      className={`${showAuthModal ? "scale-100 " : "scale-0 "} ${
        showAuthModal === null ? "hidden" : " "
      } px-6 py-4 rounded-lg shadow-2xl bg-dark-700 transition-all duration-200 transform fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20`}
      onClick={(e) => e.stopPropagation()}
    >
      <AuthComponent />
    </div>
  );
};

export default AuthModal;
