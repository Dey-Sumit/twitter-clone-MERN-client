export interface Notification {
  _id: string;
  userFrom: User;
  notificationType: "follow" | "like" | "comment";
  entityId: string;
  read: boolean;
  createdAt: Date;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  password: string;
  profilePicture: string;
  bio: string;
  likes: string[];
  following: string[];
  followers: string[];
  // virtual fields
  noOfFollowers: number;
  noOfFollowing: number;
  posts: string[];
  noOPosts: number;
}

export interface Post {
  cloudinaryImageId?: string;
  content: string;
  attachmentURL?: string;
  createdAt?: Date;
  _id: string;
  user: User;
  likes?: [string];
  tags: Tag[];
  comments?: Comment[];
  clientOnly?: boolean; // for optimistic UI
}
export interface Comment {
  user: User;
  content: string;
  _id?: string;
  clientOnly?: boolean;
  date?: Date;
}

export interface Tag {
  posts: Post[];
  _id?: string;
  name: string;
  length?: number;
}

export interface PaginatedPosts {
  posts: Post[];
  pages: number;
  page: number;
}
