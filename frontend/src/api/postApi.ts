import type { Post } from "../types";
import api from "./axios";

interface CreatePostResponse {
  success: boolean;
  message: string;
  data: Post;
}

export const createPostApi = async (
  formData: FormData
): Promise<CreatePostResponse> => {
  const res = await api.post<CreatePostResponse>(
    "/posts/create-post",
    formData
  );

  return res.data;
};
