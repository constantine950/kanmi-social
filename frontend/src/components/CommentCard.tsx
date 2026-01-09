import { Trash2 } from "lucide-react";
import type { Comment } from "../types";

interface CommentCardProp {
  isOwner: boolean;
  c: Comment;
  deleteComment: (commentId: string) => Promise<void>;
}

function CommentCard({ isOwner, c, deleteComment }: CommentCardProp) {
  return (
    <div key={c._id} className="flex gap-3">
      <img
        src={c.userId.profilePicture?.url || "/avatar-placeholder.png"}
        alt="avatar"
        className="w-8 h-8 rounded-full object-cover"
      />

      <div className="flex-1 text-sm text-stone-300">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-white">{c.userId.username}</span>

          {isOwner && (
            <button
              onClick={() => deleteComment(c._id)}
              className="text-red-400 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        <p>{c.text}</p>
      </div>
    </div>
  );
}
export default CommentCard;
