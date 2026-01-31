import type { StateCreator } from "zustand";
import type { Post } from "../../types";
import { toggleLikeApi } from "../../api/postApi";
import type { PostStore } from "./posttypes";
import { useAuthStore } from "../authStore";

export const createLikeActions = (
  set: Parameters<StateCreator<PostStore>>[0],
  get: Parameters<StateCreator<PostStore>>[1],
) => ({
  toggleLike: async (postId: string) => {
    // Prevent double-clicking with strict check
    const likingPosts = get().likingPosts;
    if (likingPosts.has(postId)) {
      return;
    }

    // Get current user ID - use 'id' field, not 'user_id'
    const currentUserId = useAuthStore.getState().user?.id;
    if (!currentUserId) {
      return;
    }

    // Immediately add to likingPosts to prevent duplicate calls
    set((state) => ({
      likingPosts: new Set(state.likingPosts).add(postId),
    }));

    // OPTIMISTIC UPDATE - Update UI immediately
    const optimisticUpdate = (posts: Post[]) =>
      posts.map((p) => {
        if (p._id !== postId) return p;

        const isLiked = p.alreadyLiked;
        const safeLikes = Array.isArray(p.likes)
          ? p.likes.filter((id) => id)
          : [];
        const newLikes = isLiked
          ? safeLikes.filter((id) => id !== currentUserId)
          : [...safeLikes, currentUserId];

        return {
          ...p,
          likes: newLikes,
          alreadyLiked: !isLiked,
        };
      });

    // Apply optimistic update immediately
    set((state) => ({
      feedPosts: optimisticUpdate(state.feedPosts),
      trendingPosts: optimisticUpdate(state.trendingPosts),
      pageCache: Object.fromEntries(
        Object.entries(state.pageCache).map(([page, posts]) => [
          page,
          optimisticUpdate(posts),
        ]),
      ),
      trendingCache: Object.fromEntries(
        Object.entries(state.trendingCache).map(([page, posts]) => [
          page,
          optimisticUpdate(posts),
        ]),
      ),
    }));

    try {
      // Sync with server in background
      const response = await toggleLikeApi(postId);

      const { likes, alreadyLiked } = response;

      // Reconcile with server response
      const serverUpdate = (posts: Post[]) =>
        posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: Array.isArray(likes) ? likes.filter((id) => id) : [],
                alreadyLiked,
              }
            : p,
        );

      set((state) => ({
        feedPosts: serverUpdate(state.feedPosts),
        trendingPosts: serverUpdate(state.trendingPosts),
        pageCache: Object.fromEntries(
          Object.entries(state.pageCache).map(([page, posts]) => [
            page,
            serverUpdate(posts),
          ]),
        ),
        trendingCache: Object.fromEntries(
          Object.entries(state.trendingCache).map(([page, posts]) => [
            page,
            serverUpdate(posts),
          ]),
        ),
      }));
    } catch (err) {
      console.error("❌ Failed to toggle like:", err);

      // ROLLBACK on error
      const rollback = (posts: Post[]) =>
        posts.map((p) => {
          if (p._id !== postId) return p;

          const isLiked = p.alreadyLiked;
          const safeLikes = Array.isArray(p.likes)
            ? p.likes.filter((id) => id)
            : [];
          const revertedLikes = isLiked
            ? safeLikes.filter((id) => id !== currentUserId)
            : [...safeLikes, currentUserId];

          return {
            ...p,
            likes: revertedLikes,
            alreadyLiked: !isLiked,
          };
        });

      set((state) => ({
        feedPosts: rollback(state.feedPosts),
        trendingPosts: rollback(state.trendingPosts),
        pageCache: Object.fromEntries(
          Object.entries(state.pageCache).map(([page, posts]) => [
            page,
            rollback(posts),
          ]),
        ),
        trendingCache: Object.fromEntries(
          Object.entries(state.trendingCache).map(([page, posts]) => [
            page,
            rollback(posts),
          ]),
        ),
      }));
    } finally {
      setTimeout(() => {
        set((state) => {
          const newLikingPosts = new Set(state.likingPosts);
          newLikingPosts.delete(postId);
          return { likingPosts: newLikingPosts };
        });
      }, 100);
    }
  },
});
