import type { StateCreator } from "zustand";
import type { Post } from "../../types";
import { createPostApi, updatePostApi, deletePostApi } from "../../api/postApi";
import type { PostStore } from "./posttypes";

export const createCrudActions = (
  set: Parameters<StateCreator<PostStore>>[0],
  get: Parameters<StateCreator<PostStore>>[1]
) => ({
  createPost: async (formData: FormData) => {
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

  updatePost: async (postId: string, formData: FormData) => {
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
});
