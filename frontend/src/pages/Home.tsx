import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";

export default function Home() {
  const posts = [
    {
      username: "alice",
      profilePic: "/mock/alice.jpg",
      text: "Enjoying the minimal Kanmi feed!",
      image: "/cabin-001.jpg",
      likes: 12,
      time: "2h ago",
      comments: [
        { username: "bob", text: "Nice!" },
        { username: "charlie", text: "Love this!" },
      ],
    },
    {
      username: "bob",
      profilePic: "/mock/bob.jpg",
      text: "Just a short thought for the day.",
      likes: 5,
      time: "5h ago",
      comments: [{ username: "alice", text: "Interesting..." }],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] pt-8">
      <div className="max-w-xl mx-auto w-full px-4 md:px-0 space-y-6">
        <h1 className="text-2xl md:text-3xl font-[Playfair_Display]">
          Home Feed
        </h1>

        {/* CREATE POST */}
        <CreatePost />

        {/* FEED */}
        {posts.map((post, i) => (
          <PostCard key={i} {...post} />
        ))}
      </div>
    </div>
  );
}
