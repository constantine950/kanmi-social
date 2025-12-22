// src/zustand/postStore.ts
import { create } from "zustand";
import { createPostApi, getPostsApi, toggleLikeApi } from "../api/postApi";
import type { Post } from "../types";
import { useAuthStore } from "./authStore";

interface PostStore {
  posts: Post[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  pageCache: Record<number, Post[]>;

  fetchPosts: () => Promise<void>;
  createPost: (formData: FormData) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
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
      const posts = await getPostsApi(page);

      set((state) => ({
        posts: [...state.posts, ...posts],
        pageCache: {
          ...state.pageCache,
          [page]: posts,
        },
        page: state.page + 1,
        hasMore: posts.length > 0,
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

  toggleLike: async (postId: string) => {
    const userId = useAuthStore.getState().user?._id;
    if (!userId) return;

    // ✅ Optimistic update ONLY
    set((state) => ({
      posts: state.posts.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: p.likes.includes(userId)
                ? p.likes.filter((id) => id !== userId)
                : [...p.likes, userId],
            }
          : p
      ),
    }));

    try {
      await toggleLikeApi(postId);
    } catch {
      // rollback
      set((state) => ({
        posts: state.posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: p.likes.includes(userId)
                  ? p.likes.filter((id) => id !== userId)
                  : [...p.likes, userId],
              }
            : p
        ),
      }));
    }
  },

  resetFeed: () =>
    set({
      posts: [],
      page: 1,
      hasMore: true,
      pageCache: {},
    }),
}));
