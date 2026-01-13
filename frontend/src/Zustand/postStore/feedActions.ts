import type { StateCreator } from "zustand";
import { getPostsApi } from "../../api/postApi";
import { shuffleArray } from "../../utils/shuffle";
import type { PostStore } from "./posttypes";

export const createFeedActions = (
  set: Parameters<StateCreator<PostStore>>[0],
  get: Parameters<StateCreator<PostStore>>[1]
) => ({
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

  resetFeed: () =>
    set({
      feedPosts: [],
      page: 1,
      hasMore: true,
      pageCache: {},
      likingPosts: new Set(),
      updatingPostId: null,
    }),
});
