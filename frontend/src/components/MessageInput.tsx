import type { ChangeEvent } from "react";

interface MessageInputProp {
  newMessage: string;
  setNewMessage: (value: React.SetStateAction<string>) => void;
  sendingMessage: boolean;
  handleSendMessage: () => Promise<void>;
  imagePreview: string | null;
  removeImage: () => void;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  imageFile: File | null;
}

export default function MessageInput({
  newMessage,
  setNewMessage,
  sendingMessage,
  handleSendMessage,
  imagePreview,
  removeImage,
  handleImageChange,
  imageFile,
}: MessageInputProp) {
  return (
    <div className="p-3 border-t border-stone-800 flex flex-col md:flex-row gap-2 shrink-0">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 text-sm text-stone-200"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && !sendingMessage && handleSendMessage()
        }
        disabled={sendingMessage}
      />
      <div className="flex items-center gap-2">
        {imagePreview && (
          <div className="flex items-center gap-2 border border-stone-700 bg-stone-950 p-1">
            <img
              src={imagePreview}
              alt="preview"
              className="w-8 h-8 object-cover border border-stone-700"
            />
            <button
              onClick={removeImage}
              className="w-8 h-8 grid place-items-center border border-stone-700 bg-stone-900 text-stone-200 text-xs"
            >
              ✖
            </button>
          </div>
        )}
        <label
          htmlFor="chatImage"
          className="inline-flex items-center gap-2 px-3 py-2 border border-stone-800 bg-stone-900 text-stone-200 text-sm cursor-pointer hover:bg-stone-800"
        >
          Attach image
        </label>
        <input
          id="chatImage"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          disabled={sendingMessage}
        />
      </div>
      <button
        onClick={handleSendMessage}
        disabled={sendingMessage || (!newMessage.trim() && !imageFile)}
        className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-stone-300 border border-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sendingMessage ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
