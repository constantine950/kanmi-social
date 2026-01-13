import type { StateCreator } from "zustand";
import type { Post } from "../../types";
import { toggleLikeApi } from "../../api/postApi";
import { useAuthStore } from "../authStore";
import type { PostStore } from "./posttypes";

export const createLikeActions = (
  set: Parameters<StateCreator<PostStore>>[0],
  get: Parameters<StateCreator<PostStore>>[1]
) => ({
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
});
