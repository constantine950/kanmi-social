import { memo, useRef, useState } from "react";
import { Heart, MessageCircle, Trash2, Pencil, X } from "lucide-react";
import CommentsModal from "./CommentsModal";
import type { Post } from "../types";
import { usePostStore } from "../zustand/postStore";
import { useAuthStore } from "../zustand/authStore";

interface PostCardProps {
  post: Post;
}

const PostCard = memo(function PostCard({ post }: PostCardProps) {
  const storePost = usePostStore((s) =>
    s.posts.find((p) => p._id === post._id)
  );

  const toggleLike = usePostStore((s) => s.toggleLike);
  const deletePost = usePostStore((s) => s.deletePost);
  const updatePost = usePostStore((s) => s.updatePost);

  const currentUser = useAuthStore((s) => s.user);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastTap = useRef(0);

  if (!storePost) return null;

  const { text, image, uploadedBy, createdAt } = storePost;
  const isOwner = currentUser?.user_id === uploadedBy._id;

  const startEdit = () => {
    setEditText(text);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditText("");
    setIsEditing(false);
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;

    const formData = new FormData();
    formData.append("text", editText);

    await updatePost(storePost._id, formData);
    setIsEditing(false);
  };

  const triggerDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) toggleLike(storePost._id);
    lastTap.current = now;
  };

  return (
    <>
      <div className="border border-stone-800 bg-stone-950 p-4 space-y-3">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <img
              src={uploadedBy.profilePicture?.url || "/avatar.png"}
              className="w-8 h-8 rounded-full"
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

          {/* OWNER ACTIONS */}
          <div className="flex gap-2">
            <button
              disabled={!isOwner}
              onClick={startEdit}
              className={`p-1 ${
                isOwner
                  ? "text-stone-400 hover:text-white"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <Pencil size={16} />
            </button>

            <button
              disabled={!isOwner}
              onClick={() => deletePost(storePost._id)}
              className={`p-1 ${
                isOwner
                  ? "text-red-500 hover:bg-red-500/10"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* BODY */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-black border border-stone-700 p-2 text-sm text-white"
              rows={3}
            />

            <div className="flex gap-2 justify-end">
              <button
                onClick={cancelEdit}
                className="text-xs text-stone-400 flex items-center gap-1"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={saveEdit}
                className="text-xs bg-white text-black px-3 py-1"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-300">{text}</p>
        )}

        {/* IMAGE */}
        {image?.url && !isEditing && (
          <div onClick={triggerDoubleTap}>
            <img
              src={image.url}
              className="w-full max-h-96 object-cover border border-stone-800"
            />
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-6 text-sm text-stone-400">
          <button
            onClick={() => toggleLike(storePost._id)}
            className="flex items-center gap-1"
          >
            <Heart
              size={18}
              className={
                storePost.alreadyLiked ? "text-red-500" : "text-stone-400"
              }
              fill={storePost.alreadyLiked ? "red" : "none"}
            />
            {storePost.likes.length}
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
