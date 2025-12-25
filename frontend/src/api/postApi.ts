import api from "./axios";

export const toggleLikeApi = async (postId: string) => {
  try {
    const res = await api.patch(`/posts/${postId}/like`);

    return res.data.data;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

export const getPostsApi = async (page: number, limit = 5) => {
  try {
    const res = await api.get(`/posts/get-posts?page=${page}&limit=${limit}`);

    return res.data.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const createPostApi = async (formData: FormData) => {
  try {
    const res = await api.post("/posts/create-post", formData);
    return res.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const deletePostApi = async (postId: string) => {
  const res = await api.delete(`/posts/delete-post/${postId}`);
  return res.data;
};
