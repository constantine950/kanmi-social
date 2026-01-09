import { memo, useRef, useState } from "react";
import CommentsModal from "./CommentsModal";
import type { PostCardProps } from "../types";
import { usePostStore } from "../zustand/postStore";
import { useAuthStore } from "../zustand/authStore";
import PostImg from "./PostImg";
import OwnerActions from "./OwnerActions";
import PostBody from "./PostBody";
import PostActions from "./PostActions";

const PostCard = memo(function PostCard({ post }: PostCardProps) {
  const storePost = usePostStore(
    (s) =>
      s.feedPosts.find((p) => p._id === post._id) ||
      s.trendingPosts.find((p) => p._id === post._id)
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

  const { text, image, uploadedBy, createdAt, likes, alreadyLiked } = storePost;
  const isOwner = !!uploadedBy && currentUser?.user_id === uploadedBy._id;

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
          <PostImg uploadedBy={uploadedBy} createdAt={createdAt} />

          {/* OWNER ACTIONS */}
          <OwnerActions
            isOwner={isOwner}
            startEdit={startEdit}
            storePost={storePost}
            deletePost={deletePost}
          />
        </div>

        {/* BODY */}
        {isEditing ? (
          <PostBody
            editText={editText}
            saveEdit={saveEdit}
            setEditText={setEditText}
            cancelEdit={cancelEdit}
          />
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
        <PostActions
          storePost={storePost}
          setIsModalOpen={setIsModalOpen}
          toggleLike={toggleLike}
          alreadyLiked={alreadyLiked}
          likes={likes}
        />
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
