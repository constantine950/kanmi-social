// src/zustand/postStore.ts
import { create } from "zustand";
import { createPostApi, getPostsApi } from "../api/postApi";
import type { Post } from "../types";

interface PostStore {
  posts: Post[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  pageCache: Record<number, Post[]>;

  fetchPosts: () => Promise<void>;
  createPost: (formData: FormData) => Promise<void>;
  resetFeed: () => void;
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  loading: false,
  page: 1,
  hasMore: true,
  pageCache: {},

  fetchPosts: async () => {
    const { page, pageCache, hasMore, loading } = get();
    if (!hasMore || loading) return;

    // ✅ Serve from cache
    if (pageCache[page]) {
      set((state) => ({
        posts: [...state.posts, ...pageCache[page]],
        page: state.page + 1,
      }));
      return;
    }

    set({ loading: true });

    try {
      const res = await getPostsApi(page);

      console.log(res);
      set((state) => ({
        posts: [...state.posts, ...res.data],
        pageCache: {
          ...state.pageCache,
          [page]: res.data,
        },
        page: state.page + 1,
        hasMore: res.data.length > 0,
      }));
    } finally {
      set({ loading: false });
    }
  },

  createPost: async (formData) => {
    const res = await createPostApi(formData);

    set((state) => ({
      posts: [res.data, ...state.posts],
      pageCache: {
        ...state.pageCache,
        1: [res.data, ...(state.pageCache[1] || [])],
      },
    }));
  },

  resetFeed: () =>
    set({
      posts: [],
      page: 1,
      hasMore: true,
    }),
}));
