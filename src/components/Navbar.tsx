import Loader from "@components/Loader";
import { useAuthState } from "@context/auth.context";
import { useLayoutDispatch } from "@context/layout.context";
import { User } from "@libs/types";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { SiTwitter } from "react-icons/si";

const Navbar = () => {
  const { push } = useRouter();
  const { user } = useAuthState();

  const dispatch = useLayoutDispatch();
  // const [showResultsDiv, setShowResultsDiv] = useState(false);
  const [query, setQuery] = useState("");
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(null);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  //add lol
  const goToUser = (uid: string) => {};
  useEffect(() => {
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    searchUsers();
  }, [query]);

  const searchUsers = async () => {
    clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        try {
          setLoading(true);
          const { data } = await axios.get("/api/users/search", {
            params: {
              q: query,
            },
          });
          setSearchResults(data.users);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }, 400)
    );
  };

  return (
    <div className="sticky top-0 left-0 z-10 flex items-center justify-between p-3 space-x-4 bg-dark-600 text-dark-100 md:px-10 lg:px-16">
      <SiTwitter
        className="text-blue-600 cursor-pointer sm:hidden"
        size="24"
        onClick={() => dispatch({ type: "TOGGLE_NAVBAR" })}
      />
      <div className="relative flex items-center justify-center flex-1 px-3 py-1 space-x-3 bg-dark-700">
        <BiSearchAlt />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-dark-100 focus:outline-none"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
        {/* // TODO TOP show animation */}
        <div
          className="absolute left-0 flex flex-col w-full space-y-1 rounded-sm top-8 bg-dark-600 "
          style={{ marginLeft: 0 }}
        >
          <div className="mt-2">{loading && <Loader />}</div>
          {!loading &&
            searchResults?.map((user: User) => (
              <div
                className="flex items-center px-4 py-1 space-x-6 cursor-pointer bg-dark-700"
                onClick={() => goToUser(user._id)}
              >
                <Image
                  width={28}
                  height={28}
                  src={user?.profilePicture}
                  alt=""
                  className="rounded-full w-7 h-7 "
                />
                <div>
                  <p>{user.name}</p>
                  <p className="text-blue-700">{user.username}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
      )
      {!user ? (
        // <div className="flex space-x-3">
        <button onClick={() => push("/auth")} className="p-1 text-blue-600 border border-blue-600">
          Log in
        </button>
      ) : (
        // </div>
        <div
          className="flex items-center p-2 space-x-3 rounded-md cursor-pointer hover:bg-dark-700"
          onClick={() => push(`/user/${user._id}`)}
        >
          {<span className="hidden mr-2 sm:block">Hey {user?.username}!</span>}
          <Image
            width={30}
            height={30}
            layout="fixed"
            src={user?.profilePicture}
            alt=""
            className="rounded-full "
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
