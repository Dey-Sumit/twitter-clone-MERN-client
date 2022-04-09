import Loader from "@components/Loader";
import { useAuthState } from "@context/auth.context";
import { useLayoutDispatch } from "@context/layout.context";
import { User } from "@libs/types";
import axios from "axios";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { MdCancel } from "react-icons/md";
import { SiTwitter } from "react-icons/si";
// https://smiley.cool/emoticons.php
const Navbar = () => {
  const { push } = useRouter();
  const { user } = useAuthState();

  const dispatch = useLayoutDispatch();
  // const [showResultsDiv, setShowResultsDiv] = useState(false);
  const [query, setQuery] = useState("");
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>(null);

  const goToUser = (uid: string) => {
    setQuery("");
    // setSearchResults([]);
    push(`/user/${uid}`);
  };

  const handleSearch = async (e) => {
    const value = e.target.value;

    setQuery(value);
    if (value.trim() === "") {
      setSearchResults(null);
      return;
    }

    clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        try {
          setLoading(true);
          setSearchResults([]);
          const { data } = await axios.get("/api/users/search", {
            params: {
              q: value,
            },
          });
          setSearchResults(data);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }, 600)
    );
  };

  return (
    <div className="sticky top-0 left-0 z-10 flex items-center h-[10vh] justify-between p-3 space-x-4 bg-dark-600 text-dark-100 md:px-10 lg:px-16">
      <SiTwitter
        className="flex-shrink-0 text-blue-600 cursor-pointer sm:hidden"
        size="28"
        onClick={() => dispatch({ type: "TOGGLE_NAVBAR" })}
      />
      {/* search bar */}
      <div
        className="relative flex items-center justify-center w-full px-3 py-1 space-x-3 md:w-2/3 bg-dark-700"
        onBlur={() => setShowDropDown(false)}
      >
        <BiSearchAlt />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-transparent text-dark-100 focus:outline-none"
          onChange={handleSearch}
          onClick={() => setShowDropDown(true)}
          value={query}
        />
        {showDropDown && <MdCancel className="cursor-pointer" size={25} onClick={() => setShowDropDown(false)} />}

        <div
          className={classNames(
            "absolute left-0 flex flex-col transition-all w-full space-y-1  rounded-lg shadow-md top-8 bg-dark-600 overflow-y-auto",
            {
              "h-64 opacity-100": showDropDown,
              "h-0 opacity-0": !showDropDown,
            }
          )}
          style={{ marginLeft: 0 }}
        >
          {!query.length && (
            <span className="grid h-full place-items-center">Search Users by username or names (๑◔‿◔๑)</span>
          )}
          {!loading && searchResults && !searchResults.length && (
            <span className="grid h-full place-items-center">No User Found ( ^_^)／</span>
          )}
          {loading && (
            <div className="grid h-full place-items-center">
              <Loader />
            </div>
          )}

          {searchResults?.map((user: User) => (
            <div
              className="flex items-center px-5 py-2 space-x-6 cursor-pointer bg-dark-800 hover:bg-dark-500"
              onClick={() => {
                setShowDropDown(false);
                setSearchResults(null);
                goToUser(user._id);
              }}
              key={user._id}
            >
              <Image width={38} height={38} src={user?.profilePicture} alt="" className="rounded-full " />
              <div>
                <p>{user.name}</p>
                <p className="text-blue-700">{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!user ? (
        // <div className="flex space-x-3">
        <button
          onClick={() => push("/auth")}
          className="flex-shrink-0 bg-dark-700 rounded-full py-2 px-10 shadow hover:bg-dark-600"
        >
          LogIn / SignUp
        </button>
      ) : (
        // </div>
        <div
          className="flex items-center flex-shrink-0 p-2 space-x-3 rounded-md cursor-pointer hover:bg-dark-700"
          onClick={() => push(`/user/${user._id}`)}
        >
          {<span className="hidden mr-2 sm:block">Hey {user?.username}!</span>}
          <Image
            width={40}
            height={40}
            layout="intrinsic"
            src={user?.profilePicture}
            alt=""
            className="w-8 h-8 rounded-full md:w-10 md:h-10 "
          />
        </div>
      )}
    </div>
  );
};

export default Navbar;
