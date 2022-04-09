import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite";
import { Post } from "./types";

export const usePaginatedPosts = (url: string, config?: SWRInfiniteConfiguration) => {
  // generate SWR KEY
  const getKey = (pageIndex: number) => {
    //? HACK to pass multiple q params
    let newUrl = `${url}?page=${pageIndex}`;
    return newUrl.replaceAll("?", "&").replace("&", "?");
  };

  const {
    data,
    error,
    mutate,
    size: page,
    setSize: setPage,
    isValidating,
  } = useSWRInfinite<{
    posts: Post[];
    page: number;
    pages: number;
  }>(getKey, config);

  const isReachedEnd = !isValidating && data?.[data.length - 1].page === data?.[data.length - 1].pages;
  const paginatedData = data?.map((data) => data.posts).flat() || [];

  return {
    error,
    paginatedData,
    page,
    setPage,
    isReachedEnd,
    mutate,
    isValidating,
  };
};
