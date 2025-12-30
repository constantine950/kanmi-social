import { create } from "zustand";
import {
  createPostApi,
  deletePostApi,
  getPostsApi,
  getTrendingPostsApi,
  toggleLikeApi,
  updatePostApi,
} from "../api/postApi";
import type { Post } from "../types";
import { useAuthStore } from "./authStore";
import { mergePosts } from "../utils/merge";
import { shuffleArray } from "../utils/shuffle";

interface PostStore {
  feedPosts: Post[];
  trendingPosts: Post[];
  loading: boolean;

  // Feed
  page: number;
  hasMore: boolean;
  pageCache: Record<number, Post[]>;

  // Trending
  trendingPage: number;
  trendingHasMore: boolean;
  trendingCache: Record<number, Post[]>;
  trendingLoaded: boolean;

  // Locks
  likingPosts: Set<string>;
  updatingPostId: string | null;

  // Actions
  fetchPosts: () => Promise<void>;
  fetchTrendingPosts: () => Promise<void>;
  createPost: (formData: FormData) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  updatePost: (postId: string, formData: FormData) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;

  resetFeed: () => void;
  resetTrending: () => void;
}

export const usePostStore = create<PostStore>((set, get) => ({
  feedPosts: [],
  trendingPosts: [],
  loading: false,

  // Feed
  page: 1,
  hasMore: true,
  pageCache: {},

  // Trending
  trendingPage: 1,
  trendingHasMore: true,
  trendingCache: {},
  trendingLoaded: false,

  // Locks
  likingPosts: new Set(),
  updatingPostId: null,

  fetchPosts: async () => {
    const { page, loading, feedPosts } = get();
    if (loading) return;

    set({ loading: true });

    try {
      // Fetch next page
      const posts = await getPostsApi(page);

      let newFeedPosts = [...feedPosts, ...posts];

      // If API returns empty, loop: reset page & shuffle existing posts
      if (posts.length === 0) {
        set({ page: 1 }); // reset page
        newFeedPosts = shuffleArray(feedPosts); // shuffle for variety
      } else {
        set({ page: page + 1 }); // increment page normally
      }

      set({ feedPosts: newFeedPosts });
    } finally {
      set({ loading: false });
    }
  },

  // =======================
  // 🔥 FETCH TRENDING
  // =======================
  fetchTrendingPosts: async () => {
    const {
      trendingPage,
      trendingCache,
      trendingHasMore,
      loading,
      trendingPosts,
    } = get();

    if (!trendingHasMore || loading) return;

    if (trendingCache[trendingPage]) {
      set((state) => ({
        trendingPosts: mergePosts(trendingPosts, trendingCache[trendingPage]),
        trendingPage: state.trendingPage + 1,
      }));
      return;
    }

    set({ loading: true });

    try {
      const res = await getTrendingPostsApi(trendingPage);

      set((state) => ({
        trendingPosts: mergePosts(trendingPosts, res.data),
        trendingCache: {
          ...state.trendingCache,
          [trendingPage]: res.data,
        },
        trendingPage: state.trendingPage + 1,
        trendingHasMore: res.hasMore,
        trendingLoaded: true,
      }));
    } finally {
      set({ loading: false });
    }
  },

  // =======================
  // ✏️ CREATE POST
  // =======================
  createPost: async (formData) => {
    const res = await createPostApi(formData);

    const newPost: Post = {
      ...res.data,
      alreadyLiked: false,
      likes: [],
    };

    set((state) => ({
      feedPosts: [newPost, ...state.feedPosts],
      trendingPosts: [newPost, ...state.trendingPosts],
      pageCache: {
        ...state.pageCache,
        1: [newPost, ...(state.pageCache[1] || [])],
      },
      trendingCache: {
        ...state.trendingCache,
        1: [newPost, ...(state.trendingCache[1] || [])],
      },
    }));
  },

  // =======================
  // ❤️ TOGGLE LIKE
  // =======================
  toggleLike: async (postId: string) => {
    const userId = useAuthStore.getState().user?.user_id;
    if (!userId) return;

    const { likingPosts, feedPosts, trendingPosts } = get();
    if (likingPosts.has(postId)) return;

    const post = [...feedPosts, ...trendingPosts].find((p) => p._id === postId);
    if (!post) return;

    const wasLiked = post.alreadyLiked;
    const previousLikes = [...post.likes];

    // lock
    set((state) => {
      const next = new Set(state.likingPosts);
      next.add(postId);
      return { likingPosts: next };
    });

    // optimistic update
    const updatePosts = (posts: Post[]) =>
      posts.map((p) =>
        p._id === postId
          ? {
              ...p,
              alreadyLiked: !wasLiked,
              likes: wasLiked
                ? p.likes.filter((id) => id !== userId)
                : [...p.likes, userId],
            }
          : p
      );

    set(() => ({
      feedPosts: updatePosts(feedPosts),
      trendingPosts: updatePosts(trendingPosts),
    }));

    try {
      const response = await toggleLikeApi(postId);

      const updatePostsResponse = (posts: Post[]) =>
        posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                alreadyLiked: response.alreadyLiked,
                likes: response.likes,
              }
            : p
        );

      set(() => ({
        feedPosts: updatePostsResponse(feedPosts),
        trendingPosts: updatePostsResponse(trendingPosts),
      }));
    } catch {
      // rollback
      const rollbackPosts = (posts: Post[]) =>
        posts.map((p) =>
          p._id === postId
            ? { ...p, alreadyLiked: wasLiked, likes: previousLikes }
            : p
        );

      set(() => ({
        feedPosts: rollbackPosts(feedPosts),
        trendingPosts: rollbackPosts(trendingPosts),
      }));
    } finally {
      set((state) => {
        const next = new Set(state.likingPosts);
        next.delete(postId);
        return { likingPosts: next };
      });
    }
  },

  // =======================
  // ✏️ UPDATE POST
  // =======================
  updatePost: async (postId, formData) => {
    if (get().updatingPostId === postId) return;
    set({ updatingPostId: postId });

    try {
      const res = await updatePostApi(postId, formData);

      const updatePosts = (posts: Post[]) =>
        posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                ...res.data,
                uploadedBy: p.uploadedBy,
                alreadyLiked: p.alreadyLiked,
              }
            : p
        );

      set(() => ({
        feedPosts: updatePosts(get().feedPosts),
        trendingPosts: updatePosts(get().trendingPosts),
        pageCache: Object.fromEntries(
          Object.entries(get().pageCache).map(([page, posts]) => [
            page,
            updatePosts(posts),
          ])
        ),
        trendingCache: Object.fromEntries(
          Object.entries(get().trendingCache).map(([page, posts]) => [
            page,
            updatePosts(posts),
          ])
        ),
      }));
    } finally {
      set({ updatingPostId: null });
    }
  },

  // =======================
  // 🗑️ DELETE POST
  // =======================
  deletePost: async (postId: string) => {
    try {
      await deletePostApi(postId);

      const filterPosts = (posts: Post[]) =>
        posts.filter((p) => p._id !== postId);

      set((state) => ({
        feedPosts: filterPosts(state.feedPosts),
        trendingPosts: filterPosts(state.trendingPosts),
        pageCache: Object.fromEntries(
          Object.entries(state.pageCache).map(([page, posts]) => [
            page,
            filterPosts(posts),
          ])
        ),
        trendingCache: Object.fromEntries(
          Object.entries(state.trendingCache).map(([page, posts]) => [
            page,
            filterPosts(posts),
          ])
        ),
      }));
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  },

  // =======================
  // 🔄 RESET
  // =======================
  resetFeed: () =>
    set({
      feedPosts: [],
      page: 1,
      hasMore: true,
      pageCache: {},
      likingPosts: new Set(),
      updatingPostId: null,
    }),

  resetTrending: () =>
    set({
      trendingPosts: [],
      trendingPage: 1,
      trendingHasMore: true,
      trendingCache: {},
      trendingLoaded: false,
      likingPosts: new Set(),
      updatingPostId: null,
    }),
}));
