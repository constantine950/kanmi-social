export interface Feature {
  text: string;
  title: string;
}

export interface featureProps {
  i: number;
  card: Feature;
}

export interface Mockpost {
  id: number;
  username: string;
  content: string;
}

export interface MockPostProp {
  post: Mockpost;
}

export interface PostStore {
  posts: Post[];
  loading: boolean;
  createPost: (formData: FormData) => Promise<void>;
}

export interface PostImage {
  url: string;
  publicId: string;
}

export interface User {
  _id: string;
  username: string;
  profilePicture?: {
    url: string;
    publicId: string;
  };
}

export interface Post {
  _id: string;
  text: string;
  image?: {
    url: string;
    publicId: string;
  } | null;
  uploadedBy: User;
  likes: string[]; // Array of user ID strings
  alreadyLiked: boolean;
  createdAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userId: {
    username: string;
    profilePicture?: {
      url: string;
    };
  };
}
