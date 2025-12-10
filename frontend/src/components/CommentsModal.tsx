import { X } from "lucide-react";
import { useState } from "react";

interface Comment {
  username: string;
  text: string;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

export default function CommentsModal({
  isOpen,
  onClose,
  comments,
  setComments,
}: CommentsModalProps) {
  const [commentInput, setCommentInput] = useState("");

  if (!isOpen) return null;

  const addComment = () => {
    if (!commentInput.trim()) return;
    setComments((prev) => [...prev, { username: "you", text: commentInput }]);
    setCommentInput("");
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-end animate-fadeIn">
      <div className="w-full max-w-md h-[75vh] bg-stone-950 border-t border-stone-800 rounded-t-2xl p-4 animate-slideUp flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-800">
          <h2 className="text-lg font-semibold text-white">Comments</h2>
          <button onClick={onClose}>
            <X size={20} className="text-stone-300" />
          </button>
        </div>

        {/* COMMENTS LIST */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-4">
          {comments.length === 0 && (
            <p className="text-stone-400 text-sm text-center">
              No comments yet.
            </p>
          )}

          {comments.map((c, i) => (
            <div key={i} className="text-sm text-stone-300">
              <span className="font-semibold text-white">{c.username}</span>{" "}
              {c.text}
            </div>
          ))}
        </div>

        {/* ADD COMMENT */}
        <div className="flex gap-2 mt-3 border-t border-stone-800 pt-3">
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addComment()}
          />

          <button
            onClick={addComment}
            className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-stone-300 transition"
          >
            Post
          </button>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>
        {`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.27s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); }
          to { transform: translateY(0); }
        }
      `}
      </style>
    </div>
  );
}
