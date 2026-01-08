import { X, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getCommentsApi,
  addCommentApi,
  deleteCommentApi,
} from "../api/commentApi";
import type { Comment, CommentsModalProps } from "../types";
import { useAuthStore } from "../zustand/authStore";
import { useUIStore } from "../zustand/uiStore";

export default function CommentsModal({
  postId,
  isOpen,
  onClose,
}: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = useAuthStore((s) => s.user);
  const showToast = useUIStore((s) => s.showToast);

  // 🔄 FETCH COMMENTS
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

  // ➕ ADD COMMENT
  const addComment = async () => {
    if (!commentInput.trim() || !currentUser) return;

    const optimisticComment: Comment = {
      _id: crypto.randomUUID(),
      text: commentInput,
      createdAt: new Date().toISOString(),
      userId: {
        _id: currentUser.user_id,
        username: currentUser.username,
        profilePicture: currentUser.profilePicture,
      },
    };

    setComments((prev) => [optimisticComment, ...prev]);
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
      showToast("Failed to post comment", "error");
    }
  };

  // 🗑️ DELETE COMMENT (ONLY OWNER)
  const deleteComment = async (commentId: string) => {
    const previousComments = comments;

    setComments((prev) => prev.filter((c) => c._id !== commentId));

    try {
      await deleteCommentApi(commentId);
      showToast("Comment deleted", "success");
    } catch {
      setComments(previousComments);
      showToast("Failed to delete comment", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-end">
      <div className="w-full max-w-md h-[75vh] bg-stone-950 border-t border-stone-800 rounded-t-2xl p-4 flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center pb-3 border-b border-stone-800">
          <h2 className="text-lg font-semibold text-white">Comments</h2>
          <button onClick={onClose}>
            <X size={20} className="text-stone-300" />
          </button>
        </div>

        {/* COMMENTS LIST */}
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

          {comments.map((c) => {
            const isOwner = c.userId._id === currentUser?.user_id;

            return (
              <div key={c._id} className="flex gap-3">
                <img
                  src={
                    c.userId.profilePicture?.url || "/avatar-placeholder.png"
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />

                <div className="flex-1 text-sm text-stone-300">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">
                      {c.userId.username}
                    </span>

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
          })}
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
