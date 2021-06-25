import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import NextNprogress from "nextjs-progressbar";
import { useLayoutState } from "@context/layout.context";
import Overlay from "./Overlay";
import ConfirmationModal from "./modals/ConfirmationModal";
import AuthModal from "./modals/AuthModal";
const Layout = ({ children }) => {
  const { showAuthModal, showConfirmationModal } = useLayoutState();

  return (
    <div className="flex ">
      <NextNprogress
        color="#29D"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        options={{ showSpinner: false }}
      />

      {(showAuthModal || showConfirmationModal) && <Overlay />}
      <AuthModal />

      <ConfirmationModal />
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="px-2 py-1 lg:px-20">
          {/* // wrapper 👆 */}
          {children}
        </div>
      </div>
    </div>
  );
};
// sm->640
export default Layout;
