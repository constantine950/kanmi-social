import type { Post } from "../../types";

export interface PostState {
  feedPosts: Post[];
  trendingPosts: Post[];
  loading: boolean;

  // Feed
  page: number;
  hasMore: boolean;
  pageCache: Record<number, Post[]>;

  // Trending
  trendingPage: number;
  trendingHasMore: boolean;
  trendingCache: Record<number, Post[]>;
  trendingLoaded: boolean;

  // Locks
  likingPosts: Set<string>;
  updatingPostId: string | null;
}

export interface PostActions {
  fetchPosts: () => Promise<void>;
  fetchTrendingPosts: () => Promise<void>;
  createPost: (formData: FormData) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  updatePost: (postId: string, formData: FormData) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  resetFeed: () => void;
  resetTrending: () => void;
}

export type PostStore = PostState & PostActions;
