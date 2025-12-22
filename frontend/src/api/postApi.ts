import api from "./axios";

export const toggleLikeApi = async (postId: string) => {
  const res = await api.patch(`/posts/${postId}/like`);
  return res.data;
};

export const getPostsApi = async (page: number, limit = 5) => {
  const res = await api.get(`/posts/get-posts?page=${page}&limit=${limit}`);

  return res.data.posts;
};

export const createPostApi = async (formData: FormData) => {
  const res = await api.post("/posts/create-post", formData);

  return res.data;
};
