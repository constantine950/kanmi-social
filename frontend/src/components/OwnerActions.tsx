import { Pencil, Trash2 } from "lucide-react";
import type { Post } from "../types";

interface OwnerActionProp {
  isOwner: boolean;
  startEdit: () => void;
  deletePost: (postId: string) => Promise<void>;
  storePost: Post;
}

export default function OwnerActions({
  isOwner,
  startEdit,
  deletePost,
  storePost,
}: OwnerActionProp) {
  return (
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
  );
}
