import { X } from "lucide-react";

interface PostBodyProp {
  editText: string;
  setEditText: (value: React.SetStateAction<string>) => void;
  cancelEdit: () => void;
  saveEdit: () => Promise<void>;
}

export default function PostBody({
  editText,
  setEditText,
  cancelEdit,
  saveEdit,
}: PostBodyProp) {
  return (
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
  );
}
