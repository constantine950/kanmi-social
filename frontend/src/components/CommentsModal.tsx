import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCommentsApi, addCommentApi } from "../api/commentApi";
import type { Comment, CommentsModalProps } from "../types";

export default function CommentsModal({
  postId,
  isOpen,
  onClose,
}: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getCommentsApi(postId);
        setComments(data);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [isOpen, postId]);

  const addComment = async () => {
    if (!commentInput.trim()) return;

    const optimisticComment: Comment = {
      _id: crypto.randomUUID(),
      text: commentInput,
      createdAt: new Date().toISOString(),
      userId: {
        username: "You",
      },
    };

    setComments((prev) => [...prev, optimisticComment]);
    setCommentInput("");

    try {
      const saved = await addCommentApi(postId, optimisticComment.text);
      setComments((prev) =>
        prev.map((c) => (c._id === optimisticComment._id ? saved : c))
      );
    } catch {
      setComments((prev) =>
        prev.filter((c) => c._id !== optimisticComment._id)
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-end animate-fadeIn">
      {/* ⬇️ SAME BOTTOM SHEET */}
      <div className="w-full max-w-md h-[75vh] bg-stone-950 border-t border-stone-800 rounded-t-2xl p-4 flex flex-col animate-slideUp">
        {/* HEADER */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-800">
          <h2 className="text-lg font-semibold text-white">Comments</h2>
          <button onClick={onClose}>
            <X size={20} className="text-stone-300" />
          </button>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-4">
          {loading && (
            <p className="text-stone-400 text-sm text-center">
              Loading comments…
            </p>
          )}

          {!loading && comments.length === 0 && (
            <p className="text-stone-400 text-sm text-center">
              No comments yet.
            </p>
          )}

          {comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <img
                src={c.userId.profilePicture?.url || "/avatar-placeholder.png"}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />

              <div className="text-sm text-stone-300">
                <span className="font-semibold text-white">
                  {c.userId.username}
                </span>{" "}
                {c.text}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="flex gap-2 mt-3 border-t border-stone-800 pt-3">
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addComment()}
            placeholder="Write a comment…"
            className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none"
          />
          <button
            onClick={addComment}
            className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-stone-300"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
