import type { StateCreator } from "zustand";
import { getTrendingPostsApi } from "../../api/postApi";
import { mergePosts } from "../../utils/merge";
import type { PostStore } from "./posttypes";

export const createTrendingActions = (
  set: Parameters<StateCreator<PostStore>>[0],
  get: Parameters<StateCreator<PostStore>>[1]
) => ({
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
});
