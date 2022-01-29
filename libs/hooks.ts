import useSWRInfinite from "swr/infinite";
import { PaginatedPosts, Post } from "./types";

export const usePaginatedPosts = (URL: string) => {
  const {
    data,
    error,
    mutate,
    size: page,
    setSize: setPage,
    isValidating,
  } = useSWRInfinite<PaginatedPosts>((index) => {
    //? HACK to pass multiple q params
    let newURL = `${URL}?page=${index}`;
    newURL = URL.replaceAll("?", "&");
    newURL = newURL.replace("&", "?");
    return newURL;
  });

  const posts: Post[] = data ? [].concat(...data.map((paginatedPost) => paginatedPost.posts)) : [];

  const isReachingEnd = !isValidating && data?.[data.length - 1].page === data?.[data.length - 1].pages;

  return {
    error,
    posts,
    page,
    setPage,
    isReachingEnd,
    mutate,
    isValidating,
  };
};
