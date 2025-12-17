import { useRef, useState } from "react";
import { Image, X } from "lucide-react";
import { usePostStore } from "../zustand/postStore";
import { useUIStore } from "../zustand/uiStore";

export default function CreatePost() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const createPost = usePostStore((s) => s.createPost);
  const loading = usePostStore((s) => s.loading);
  const showToast = useUIStore((s) => s.showToast);

  const handleImageSelect = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      showToast("Post text is required", "error");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("postPicture", image);

    try {
      await createPost(formData);
      showToast("Post created successfully", "success");
      setText("");
      removeImage();
    } catch (error) {
      showToast("Failed to create post", "error");
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-stone-800 p-4 bg-stone-950 space-y-3"
    >
      {/* Text */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full bg-black border border-stone-800 text-sm p-2 text-white resize-none focus:outline-none"
        rows={3}
      />

      {/* Image preview */}
      {preview && (
        <div className="relative">
          <img
            src={preview}
            alt="preview"
            className="w-full rounded border border-stone-800"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-black/70 p-1 rounded"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageSelect(file);
          }}
        />

        {/* Custom image button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 text-xs text-stone-400 hover:text-white"
        >
          <Image size={16} />
          {image ? "Change image" : "Add image"}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-1 text-xs bg-white text-black disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
