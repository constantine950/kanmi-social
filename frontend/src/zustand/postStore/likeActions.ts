import type { StateCreator } from "zustand";
import type { Post } from "../../types";
import { toggleLikeApi } from "../../api/postApi";
import { useAuthStore } from "../authStore";
import type { PostStore } from "./posttypes";

export const createLikeActions = (
  set: Parameters<StateCreator<PostStore>>[0],
  get: Parameters<StateCreator<PostStore>>[1],
) => ({
  toggleLike: async (postId: string) => {
    const userId = useAuthStore.getState().user?.user_id;
    if (!userId) return;

    if (get().likingPosts.has(postId)) return;

    const post = [...get().feedPosts, ...get().trendingPosts].find(
      (p) => p._id === postId,
    );
    if (!post) return;

    const wasLiked = post.alreadyLiked;
    const previousLikes = [...post.likes];

    // 🔒 lock
    set((state) => ({
      likingPosts: new Set(state.likingPosts).add(postId),
    }));

    // ✅ OPTIMISTIC UPDATE (FIXED)
    set((state) => {
      const update = (posts: Post[]) =>
        posts.map((p) => {
          if (p._id !== postId) return p;

          const isLiked = p.likes.includes(userId); // 👈 SOURCE OF TRUTH

          return {
            ...p,
            alreadyLiked: !isLiked,
            likes: isLiked
              ? p.likes.filter((id) => id !== userId) // UNLIKE
              : [...p.likes, userId], // LIKE
          };
        });

      return {
        feedPosts: update(state.feedPosts),
        trendingPosts: update(state.trendingPosts),
      };
    });

    try {
      const response = await toggleLikeApi(postId);

      // ✅ SERVER SYNC (AGAIN USING CURRENT STATE)
      set((state) => {
        const update = (posts: Post[]) =>
          posts.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  alreadyLiked: response.alreadyLiked,
                  likes: response.likes,
                }
              : p,
          );

        return {
          feedPosts: update(state.feedPosts),
          trendingPosts: update(state.trendingPosts),
        };
      });
    } catch {
      // 🔁 ROLLBACK
      set((state) => {
        const rollback = (posts: Post[]) =>
          posts.map((p) =>
            p._id === postId
              ? {
                  ...p,
                  alreadyLiked: wasLiked,
                  likes: previousLikes,
                }
              : p,
          );

        return {
          feedPosts: rollback(state.feedPosts),
          trendingPosts: rollback(state.trendingPosts),
        };
      });
    } finally {
      set((state) => {
        const next = new Set(state.likingPosts);
        next.delete(postId);
        return { likingPosts: next };
      });
    }
  },
});
