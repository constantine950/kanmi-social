import api from "./axios";

export const toggleLikeApi = async (postId: string) => {
  const res = await api.patch(`/posts/${postId}/like`);
  return res.data.data;
};

export const getPostsApi = async (page: number, limit = 5) => {
  const res = await api.get(`/posts/get-posts?page=${page}&limit=${limit}`);
  return res.data.posts;
};

export async function getPostById(id: string) {
  const res = await api.get(`/posts/${id}`);
  return res.data.data;
}

export const getUserPosts = () => api.get("/posts/get-user-posts");

export const getTrendingPostsApi = async (page = 1) => {
  const res = await api.get(`/posts/trending?page=${page}&limit=5`);
  return res.data;
};

export const createPostApi = async (formData: FormData) => {
  const res = await api.post("/posts/create-post", formData);
  return res.data;
};

export const deletePostApi = async (postId: string) => {
  const res = await api.delete(`/posts/delete-post/${postId}`);
  return res.data;
};

export const updatePostApi = async (postId: string, formData: FormData) => {
  const res = await api.patch(`/posts/update-post/${postId}`, formData);

  return res.data;
};
