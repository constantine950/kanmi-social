import { useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import { usePostStore } from "../zustand/postStore";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

export default function Home() {
  const { feedPosts, fetchPosts, loading } = usePostStore();

  useEffect(() => {
    if (feedPosts.length === 0) {
      fetchPosts();
    }
  }, [fetchPosts, feedPosts.length]);

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
            data={feedPosts}
            endReached={() => {
              if (!loading) fetchPosts();
            }}
            itemContent={(index, post) => <PostCard post={post} />}
            overscan={300}
            components={{
              Footer: () =>
                loading ? (
                  <div className="space-y-4 animate-pulse">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-40 bg-stone-900 rounded" />
                    ))}
                  </div>
                ) : null,
            }}
          />
        </div>
      </div>
    </div>
  );
}
