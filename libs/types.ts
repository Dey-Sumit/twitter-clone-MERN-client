import mongoose from "mongoose";

type mongoose_id = string | mongoose.Types.ObjectId;
export interface User {
  _id: mongoose_id;
  name: string;
  username: string;
  password: string;
  profilePicture: string;
  bio: string;
  following: mongoose_id[];
  followers: mongoose_id[];
  // virtual fields
  noOfFollowers: number;
  noOfFollowing: number;
  posts: mongoose_id[];
  noOfPosts: number;
}

export interface FUser extends Omit<User, "_id"> {
  _id: string;
}
export interface FPost extends Omit<Post, "_id" | "user" | "likes" | "tags" | "comments"> {
  _id: string;
  user: FUser;
  likes?: [string];
  tags: FTag[];
  comments?: FComment[];
  clientOnly?: boolean; // for optimistic UI
}
export interface FTag extends Omit<Tag, "_id" | "posts"> {
  _id: string;
  posts: FPost[];
}
// frontend backend different interface
export interface Post {
  _id?: mongoose_id;
  user: mongoose_id;
  cloudinaryImageId?: string;
  content: string;
  attachmentURL?: string;
  createdAt?: Date;
  likes?: [
    {
      user: mongoose.Types.ObjectId | string;
    }
  ];
  comments?: Comment[];
  tags?: [
    {
      tag: mongoose.Types.ObjectId;
    }
  ];
}
export interface Comment {
  user: mongoose.Types.ObjectId;
  content: string;
  date?: Date;
  _id?: string;
}
export interface FComment {
  user: FUser;
  content: string;
  date?: Date;
  _id: string;
  clientOnly?: boolean;
}

export interface Tag {
  _id?: mongoose.Types.ObjectId;
  name: string;
  posts: [Post];
  length?: number;
}

export interface FPaginatedPosts {
  posts: FPost[];
  pages: number;
  page: number;
}
