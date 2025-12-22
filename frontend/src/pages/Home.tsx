// src/pages/Home.tsx
import { useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import { usePostStore } from "../zustand/postStore";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

export default function Home() {
  const { posts, fetchPosts, hasMore, loading } = usePostStore();

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, [fetchPosts, posts.length]);

  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] pt-8">
      <div className="max-w-xl mx-auto w-full px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-[Playfair_Display] mb-6">
          Home Feed
        </h1>

        {/* CREATE POST */}
        <CreatePost />

        {/* FEED */}
        <div className="h-[calc(100vh-220px)]">
          <Virtuoso
            data={posts}
            endReached={() => {
              if (hasMore && !loading) fetchPosts();
            }}
            itemContent={(index, post) => <PostCard post={post} />}
            overscan={300}
            components={{
              Footer: () =>
                loading ? (
                  <div className="py-6 text-center text-stone-500 text-sm">
                    Loading more posts…
                  </div>
                ) : !hasMore ? (
                  <div className="py-6 text-center text-stone-600 text-sm">
                    You’re all caught up ✨
                  </div>
                ) : null,
            }}
          />
        </div>
      </div>
    </div>
  );
}
