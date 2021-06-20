// DELETE THIS FILE
export interface Post {}

export interface User {
  _id: string;

  name: string;
  username: string;
  profilePicture: string;
  followers: string[];
  T;
  following: string[];
  // company: Types.ObjectId | Record<string, unknown>;
}

export interface Tag {
  _id?: string;
  name: string;
  posts: [Post];
}
