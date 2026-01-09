interface InputProp {
  commentInput: string;
  setCommentInput: (value: React.SetStateAction<string>) => void;
  addComment: () => Promise<void>;
}

export default function CommentInput({
  commentInput,
  setCommentInput,
  addComment,
}: InputProp) {
  return (
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
  );
}
