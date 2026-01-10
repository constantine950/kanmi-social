import { create } from "zustand";
import { initialPostState } from "./initialState";
import { createFeedActions } from "./feedActions";
import { createTrendingActions } from "./trendingActions";
import { createCrudActions } from "./crudActions";
import { createLikeActions } from "./likeActions";
import type { PostStore } from "./posttypes";

export const usePostStore = create<PostStore>((set, get) => ({
  ...initialPostState,
  ...createFeedActions(set, get),
  ...createTrendingActions(set, get),
  ...createCrudActions(set, get),
  ...createLikeActions(set, get),
}));

// Re-export types
export type { PostState, PostActions } from "./posttypes";
