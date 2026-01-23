import { useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import PostCard from "../components/PostCard";
import { usePostStore } from "../zustand/postStore";

export default function Explore() {
  const {
    trendingPosts,
    loading,
    trendingLoaded,
    trendingHasMore,
    fetchTrendingPosts,
  } = usePostStore();

  useEffect(() => {
    if (!trendingLoaded) {
      fetchTrendingPosts();
    }
  }, [trendingLoaded, fetchTrendingPosts]);

  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter]">
      <div className="max-w-xl mx-auto w-full px-4 md:px-6 pt-5 md:pt-8">
        <h1 className="text-2xl md:text-3xl font-[Playfair_Display] mb-6 md:mb-8">
          Explore
        </h1>
        <p className="text-sm pl-4 md:pl-0 text-stone-400">
          Trending posts based on engagement
        </p>

        <div className="border-t border-stone-800 pt-4">
          {trendingPosts.length === 0 && loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-stone-900 rounded" />
              ))}
            </div>
          ) : (
            <Virtuoso
              data={trendingPosts}
              style={{ height: "80vh" }}
              endReached={fetchTrendingPosts}
              itemContent={(_, post) => <PostCard post={post} />}
              components={{
                Footer: () => (
                  <div className="py-6 text-center text-stone-500">
                    {loading
                      ? "Loading more…"
                      : !trendingHasMore
                        ? "🎉 All caught up!"
                        : null}
                  </div>
                ),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
