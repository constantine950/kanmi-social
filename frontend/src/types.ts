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

export interface Post {
  _id: string;
  uploadedBy:
    | {
        _id: string;
        username: string;
        profilePicture?: {
          url: string;
        };
      }
    | string;

  text: string;
  image?: PostImage | null;
  likes: string[];
  createdAt: string;
}
