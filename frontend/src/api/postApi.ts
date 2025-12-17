import type { Post } from "../types";
import api from "./axios";

interface CreatePostResponse {
  success: boolean;
  message: string;
  data: Post;
}

interface GetPostsResponse {
  success: boolean;
  data: Post[];
}

export const getPostsApi = async (
  page: number,
  limit = 5
): Promise<GetPostsResponse> => {
  const res = await api.get<GetPostsResponse>(
    `/posts/get-posts?page=${page}&limit=${limit}`
  );

  return res.data;
};

export const createPostApi = async (
  formData: FormData
): Promise<CreatePostResponse> => {
  const res = await api.post<CreatePostResponse>(
    "/posts/create-post",
    formData
  );

  return res.data;
};
