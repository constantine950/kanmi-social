import PostCard from "../components/PostCard";

export default function Explore() {
  const explorePosts = [
    {
      username: "eve",
      profilePic: "/mock/eve.jpg",
      text: "Exploring Kanmi's minimal vibes! 🌿",
      image: "/mock/explore1.jpg",
      likes: 15,
      time: "1h ago",
      comments: [{ username: "alice", text: "Cool!" }],
    },
    {
      username: "frank",
      profilePic: "/mock/frank.jpg",
      text: "Just sharing a short thought.",
      likes: 8,
      time: "3h ago",
      comments: [{ username: "eve", text: "Nice one!" }],
    },
    {
      username: "grace",
      profilePic: "/mock/grace.jpg",
      text: "Check out this amazing view!",
      image: "/mock/explore2.jpg",
      likes: 23,
      time: "5h ago",
      comments: [{ username: "frank", text: "Wow!" }],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] px-6 md:px-14 pt-8">
      {/* Feed container aligned left, same as Home */}
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-[Playfair_Display] mb-4">
          Explore Trending Feed
        </h1>

        {explorePosts.map((post, i) => (
          <PostCard key={i} {...post} />
        ))}
      </div>
    </div>
  );
}
