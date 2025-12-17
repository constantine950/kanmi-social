// src/api/commentApi.ts
import api from "./axios";
import type { Comment } from "../types";

export const getCommentsApi = async (postId: string): Promise<Comment[]> => {
  const res = await api.get(`/comments/${postId}`);
  return res.data.data;
};

export const addCommentApi = async (
  postId: string,
  text: string
): Promise<Comment> => {
  const res = await api.post(`/comments/${postId}`, { text });
  return res.data.data;
};
