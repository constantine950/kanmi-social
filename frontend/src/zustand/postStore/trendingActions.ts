import type { StateCreator } from "zustand";
import { getTrendingPostsApi } from "../../api/postApi";
import type { PostStore } from "./posttypes";

export const createTrendingActions = (
  set: Parameters<StateCreator<PostStore>>[0],
  get: Parameters<StateCreator<PostStore>>[1],
) => ({
  fetchTrendingPosts: async () => {
    const { trendingPage, loading } = get();
    if (loading) return;

    set({ loading: true });

    try {
      const response = await getTrendingPostsApi(trendingPage);
      const posts = response.posts;

      set((state) => ({
        trendingPosts: [...state.trendingPosts, ...posts],
        trendingPage: trendingPage + 1,
        trendingHasMore: response.hasMore,
        trendingLoaded: true,
      }));
    } catch (error) {
      console.error("Failed to fetch trending posts:", error);
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
    }),
});
