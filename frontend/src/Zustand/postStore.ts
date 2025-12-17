import { create } from "zustand";
import { createPostApi } from "../api/postApi";
import type { PostStore } from "../types";

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  loading: false,

  createPost: async (formData) => {
    set({ loading: true });

    try {
      const res = await createPostApi(formData);
      set((state) => ({
        posts: [res.data, ...state.posts],
      }));
    } finally {
      set({ loading: false });
    }
  },
}));
