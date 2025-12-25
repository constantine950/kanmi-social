import { memo, useState, useRef } from "react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import CommentsModal from "./CommentsModal";
import type { Post } from "../types";
import { usePostStore } from "../zustand/postStore";
import { useAuthStore } from "../zustand/authStore";

interface PostCardProps {
  post: Post;
}

const PostCard = memo(function PostCard({ post }: PostCardProps) {
  // 🔗 Subscribe ONLY to this post
  const storePost = usePostStore((s) =>
    s.posts.find((p) => p._id === post._id)
  );

  const toggleLike = usePostStore((s) => s.toggleLike);
  const deletePost = usePostStore((s) => s.deletePost);

  // 🔒 In-flight like lock (per post)
  const isLiking = usePostStore((s) => s.likingPosts.has(post._id));

  // ⚠️ Hooks MUST be called unconditionally
  const [burst, setBurst] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastTap = useRef(0);
  const currentUser = useAuthStore((s) => s.user);

  // 🛡️ Safe early return AFTER hooks
  if (!storePost) return null;

  const { text, image, uploadedBy, createdAt } = storePost;
  const liked = storePost.alreadyLiked;
  const likeCount = storePost.likes.length;

  const isOwner = currentUser?.user_id === uploadedBy._id;

  const triggerDoubleTap = () => {
    if (isLiking) return;

    const now = Date.now();

    if (now - lastTap.current < 300) {
      if (!liked) toggleLike(storePost._id);

      setBurst(true);
      setTimeout(() => setBurst(false), 500);
    }

    lastTap.current = now;
  };

  const handleDelete = async () => {
    if (!isOwner) return;
    if (!confirm("Are you sure you want to delete this post?")) return;

    await deletePost(storePost._id);
  };

  return (
    <>
      <div className="border border-stone-800 bg-stone-950 p-4 space-y-3">
        {/* USER */}
        <div className="flex items-center justify-between gap-3">
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
                {new Date(createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          {/* DELETE BUTTON */}
          <button
            onClick={handleDelete}
            disabled={!isOwner}
            className={`p-1 rounded text-xs flex items-center gap-1 ${
              isOwner
                ? "text-red-500 hover:bg-red-600/10"
                : "text-stone-600 cursor-not-allowed"
            }`}
          >
            <Trash2 size={16} />
            Delete
          </button>
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
            disabled={isLiking}
            onClick={() => toggleLike(storePost._id)}
            className={`flex items-center gap-1 ${
              isLiking ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Heart
              size={18}
              className={
                isLiking
                  ? "text-stone-500 animate-pulse"
                  : liked
                  ? "text-red-500"
                  : "text-stone-300"
              }
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
        postId={storePost._id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
});

export default PostCard;
