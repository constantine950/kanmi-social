import { useState, useRef } from "react";
import { Heart, MessageCircle } from "lucide-react";
import CommentsModal from "./CommentsModal";
import type { Post } from "../types";
import { usePostStore } from "../zustand/postStore";
import { useAuthStore } from "../zustand/authStore";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { text, image, uploadedBy, likes, createdAt } = post;

  const toggleLike = usePostStore((s) => s.toggleLike);
  const userId = useAuthStore((s) => s.user?._id);

  const liked = !!userId && post.likes.includes(userId);
  const likeCount = likes.length;

  const [burst, setBurst] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lastTap = useRef(0);

  const triggerDoubleTap = () => {
    const now = Date.now();

    if (now - lastTap.current < 300) {
      if (!liked) {
        toggleLike(post._id);
      }

      setBurst(true);
      setTimeout(() => setBurst(false), 500);
    }

    lastTap.current = now;
  };

  return (
    <>
      <div className="border border-stone-800 bg-stone-950 p-4 space-y-3">
        {/* USER */}
        <div className="flex items-center gap-3">
          <img
            src={uploadedBy.profilePicture?.url || "/avatar.png"}
            alt={uploadedBy.username}
            className="w-8 h-8 rounded-full border border-stone-700 object-cover"
          />
          <div>
            <p className="text-sm font-medium text-white">
              {uploadedBy.username}
            </p>
            <p className="text-xs text-stone-500">
              {new Date(createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* TEXT */}
        <p className="text-sm text-stone-300">{text}</p>

        {/* IMAGE */}
        {image?.url && (
          <div className="relative" onClick={triggerDoubleTap}>
            <img
              src={image.url}
              alt="post"
              className="w-full max-h-96 object-cover border border-stone-800"
            />

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
          <button
            onClick={() => toggleLike(post._id)}
            className="flex items-center gap-1"
          >
            <Heart
              size={18}
              className={liked ? "text-red-500" : "text-stone-300"}
              fill={liked ? "red" : "none"}
            />
            {likeCount}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1"
          >
            <MessageCircle size={18} />
          </button>
        </div>
      </div>

      <CommentsModal
        postId={post._id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
