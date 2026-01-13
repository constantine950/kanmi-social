import { create } from "zustand";
import { initialPostState } from "./initialState.js";
import { createFeedActions } from "./feedActions.js";
import { createTrendingActions } from "./trendingActions.js";
import { createCrudActions } from "./crudActions.js";
import { createLikeActions } from "./likeActions.js";
import type { PostStore } from "./posttypes.js";

export const usePostStore = create<PostStore>((set, get) => ({
  ...initialPostState,
  ...createFeedActions(set, get),
  ...createTrendingActions(set, get),
  ...createCrudActions(set, get),
  ...createLikeActions(set, get),
}));

// Re-export types
export type { PostState, PostActions } from "./posttypes.js";
