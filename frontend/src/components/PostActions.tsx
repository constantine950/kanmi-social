import { Heart, MessageCircle } from "lucide-react";
import type { Post } from "../types";

interface PostActionsProp {
  toggleLike: (postId: string) => Promise<void>;
  storePost: Post;
  alreadyLiked: boolean;
  likes: string[];
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void;
}

export default function PostActions({
  toggleLike,
  storePost,
  alreadyLiked,
  likes,
  setIsModalOpen,
}: PostActionsProp) {
  const handleLikeClick = async () => {
    try {
      await toggleLike(storePost._id);
    } catch (error) {
      console.error("❌ Error in handleLikeClick:", error);
    }
  };

  return (
    <div className="flex gap-6 text-sm text-stone-400">
      <button
        onClick={handleLikeClick}
        className="flex items-center gap-1 hover:text-red-400 transition-colors"
      >
        <Heart
          size={18}
          className={
            alreadyLiked
              ? "text-red-500 cursor-pointer"
              : "text-stone-400 cursor-pointer"
          }
          fill={alreadyLiked ? "red" : "none"}
        />
        <span>{likes?.length || 0}</span>
      </button>

      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1 cursor-pointer hover:text-stone-200 transition-colors"
      >
        <MessageCircle size={18} />
      </button>
    </div>
  );
}
