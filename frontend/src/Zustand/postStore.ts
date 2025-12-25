import { create } from "zustand";
import {
  createPostApi,
  deletePostApi,
  getPostsApi,
  toggleLikeApi,
} from "../api/postApi";
import type { Post } from "../types";
import { useAuthStore } from "./authStore";

interface PostStore {
  posts: Post[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  pageCache: Record<number, Post[]>;

  // 🔒 like lock
  likingPosts: Set<string>;

  fetchPosts: () => Promise<void>;
  createPost: (formData: FormData) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  resetFeed: () => void;
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  loading: false,
  page: 1,
  hasMore: true,
  pageCache: {},
  likingPosts: new Set(),

  // ✅ FETCH POSTS
  fetchPosts: async () => {
    const { page, pageCache, hasMore, loading } = get();
    if (!hasMore || loading) return;

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

  // ✅ CREATE POST
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

  // ❤️ TOGGLE LIKE (LOCKED + OPTIMISTIC)
  toggleLike: async (postId: string) => {
    const userId = useAuthStore.getState().user?.user_id;
    if (!userId) return;

    const { likingPosts, posts } = get();

    // 🔒 prevent double request
    if (likingPosts.has(postId)) return;

    const post = posts.find((p) => p._id === postId);
    if (!post) return;

    const wasLiked = post.alreadyLiked;
    const previousLikes = [...post.likes];

    // 🔒 mark as in-flight
    set((state) => {
      const next = new Set(state.likingPosts);
      next.add(postId);
      return { likingPosts: next };
    });

    // ⚡ optimistic update
    set((state) => ({
      posts: state.posts.map((p) =>
        p._id === postId
          ? {
              ...p,
              alreadyLiked: !wasLiked,
              likes: wasLiked
                ? p.likes.filter((id) => id !== userId)
                : [...p.likes, userId],
            }
          : p
      ),
    }));

    try {
      const response = await toggleLikeApi(postId);

      // 🔁 sync with backend
      set((state) => ({
        posts: state.posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                alreadyLiked: response.alreadyLiked,
                likes: response.likes,
              }
            : p
        ),
      }));
    } catch (err) {
      console.error("Failed to toggle like:", err);

      // ⏪ rollback
      set((state) => ({
        posts: state.posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                alreadyLiked: wasLiked,
                likes: previousLikes,
              }
            : p
        ),
      }));
    } finally {
      // 🔓 unlock
      set((state) => {
        const next = new Set(state.likingPosts);
        next.delete(postId);
        return { likingPosts: next };
      });
    }
  },

  deletePost: async (postId: string) => {
    const userId = useAuthStore.getState().user?.user_id;
    if (!userId) return;

    const postIndex = get().posts.findIndex((p) => p._id === postId);
    if (postIndex === -1) return;

    try {
      await deletePostApi(postId);

      // Remove post from store
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== postId),
        pageCache: Object.fromEntries(
          Object.entries(state.pageCache).map(([page, posts]) => [
            page,
            posts.filter((p) => p._id !== postId),
          ])
        ),
      }));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  },

  resetFeed: () =>
    set({
      posts: [],
      page: 1,
      hasMore: true,
      pageCache: {},
      likingPosts: new Set(),
    }),
}));
