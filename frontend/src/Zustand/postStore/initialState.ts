import type { PostState } from "./posttypes";

export const initialPostState: PostState = {
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
};
