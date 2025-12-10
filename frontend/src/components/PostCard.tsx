import { useState, useRef } from "react";
import { Heart, MessageCircle } from "lucide-react";
import CommentsModal from "./CommentsModal";

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
  const [allComments, setAllComments] = useState<Comment[]>(comments);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [burst, setBurst] = useState(false);

  const [showInput, setShowInput] = useState(false);
  const [commentText, setCommentText] = useState("");

  const lastTap = useRef(0);

  const handleLikeToggle = () => {
    // toggle like state and update count
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : c - 1));
      return next;
    });
  };

  const triggerDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      // double-tap detected: like + burst
      if (!liked) {
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
      setBurst(true);
      setTimeout(() => setBurst(false), 550);
    }
    lastTap.current = now;
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setAllComments((prev) => [...prev, { username: "you", text: commentText }]);
    setCommentText("");
    setShowInput(false);
  };

  const latestComment = allComments[allComments.length - 1];

  return (
    <>
      <div className="border border-stone-800 bg-stone-950 p-4 space-y-3">
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

        {/* TEXT */}
        <p className="text-sm text-stone-300">{text}</p>

        {/* IMAGE WITH DOUBLE-TAP */}
        {image && (
          <div className="relative" onClick={triggerDoubleTap}>
            <img
              src={image}
              alt="post"
              className="w-full max-h-96 object-cover border border-stone-800"
            />

            {/* HEART BURST */}
            {burst && (
              <Heart
                className="absolute inset-0 m-auto w-24 h-24 text-red-500 opacity-90 animate-ping"
                fill="red"
              />
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center gap-6 text-sm text-stone-300 pt-2">
          {/* LIKE */}
          <div
            className="flex items-center gap-1 cursor-pointer select-none"
            onClick={handleLikeToggle}
            role="button"
            aria-pressed={liked}
          >
            <Heart
              size={18}
              // when liked, make the heart red and filled
              className={liked ? "text-red-500" : "text-stone-300"}
              fill={liked ? "red" : "none"}
            />
            <span>{likeCount}</span>
          </div>

          {/* COMMENT (opens modal) */}
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <MessageCircle size={18} />
            <span>{allComments.length}</span>
          </div>
        </div>

        {/* LATEST COMMENT */}
        {latestComment && (
          <div className="mt-2 text-sm text-stone-300">
            <span className="font-medium text-white">
              {latestComment.username}
            </span>{" "}
            {latestComment.text}
          </div>
        )}

        {/* VIEW ALL COMMENTS */}
        {allComments.length > 1 && (
          <button
            className="text-xs text-stone-400 mt-1 hover:text-white"
            onClick={() => setIsModalOpen(true)}
          >
            View all {allComments.length} comments
          </button>
        )}

        {/* Inline comment input - toggled by some UI if you want (kept for compatibility) */}
        {showInput && (
          <div className="flex gap-2 mt-3">
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
              className="px-3 py-2 bg-white text-black text-sm font-medium hover:bg-stone-300 transition"
            >
              Post
            </button>
          </div>
        )}
      </div>

      {/* COMMENTS MODAL (expects CommentsModal to accept setComments) */}
      <CommentsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        comments={allComments}
        setComments={setAllComments}
      />
    </>
  );
}
