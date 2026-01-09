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
  return (
    <div className="flex gap-6 text-sm text-stone-400">
      <button
        onClick={() => toggleLike(storePost._id)}
        className="flex items-center gap-1"
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
        {likes?.length || 0}
      </button>

      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-1 cursor-pointer"
      >
        <MessageCircle size={18} />
      </button>
    </div>
  );
}
