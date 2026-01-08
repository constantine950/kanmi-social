import api from "./axios";

export const getCommentsApi = async (postId: string) => {
  const res = await api.get(`/comments/${postId}`);
  return res.data.data;
};

export const deleteCommentApi = async (commentId: string) => {
  const res = await api.delete(`/comments/delete/${commentId}`);
  return res.data;
};

export const addCommentApi = async (postId: string, text: string) => {
  const res = await api.post(`/comments/${postId}`, { text });
  return res.data.data;
};
