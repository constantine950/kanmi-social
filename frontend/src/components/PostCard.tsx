import { useState } from "react";

interface Comment {
  username: string;
  text: string;
}

interface PostCardProps {
  username: string;
  profilePic: string;
  text: string;
  image?: string;
  likes: number;
  time?: string;
  comments?: Comment[];
}

export default function PostCard({
  username,
  profilePic,
  text,
  image,
  likes,
  time,
  comments = [],
}: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState<Comment[]>(comments);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setAllComments([...allComments, { username: "you", text: commentText }]);
    setCommentText("");
  };

  return (
    <div className="border border-stone-800 bg-stone-950 p-4 rounded-none space-y-3">
      {/* USER INFO */}
      <div className="flex items-center gap-3">
        <img
          src={profilePic}
          alt={username}
          className="w-8 h-8 rounded-full border border-stone-700 object-cover"
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{username}</span>
          <span className="text-xs text-stone-500">{time}</span>
        </div>
      </div>

      {/* POST TEXT */}
      <p className="text-sm text-stone-400">{text}</p>

      {/* POST IMAGE (optional) */}
      {image && (
        <div>
          <img
            src={image}
            alt="post"
            className="w-full max-h-96 object-cover border border-stone-800"
          />
        </div>
      )}

      {/* LIKES */}
      <div className="flex items-center gap-2 text-sm text-stone-400">
        <span>❤️ {likes}</span>
      </div>

      {/* COMMENTS */}
      <div className="space-y-2 mt-2">
        {allComments.map((c, i) => (
          <div key={i} className="text-sm text-stone-400">
            <span className="font-medium text-white">{c.username}</span>:{" "}
            {c.text}
          </div>
        ))}
      </div>

      {/* ADD COMMENT */}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
        />
        <button
          onClick={handleAddComment}
          className="px-3 py-2 bg-white text-black text-sm uppercase font-medium hover:bg-stone-300 transition-colors"
        >
          Post
        </button>
      </div>
    </div>
  );
}
