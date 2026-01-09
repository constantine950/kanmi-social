import { Trash2 } from "lucide-react";

interface Message {
  _id: string;
  text?: string;
  sender: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  receiver: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  image?: {
    url: string;
    publicId: string;
  };
  createdAt: string;
}

interface MessageCardProp {
  isYou: boolean;
  msg: Message;
  handleDeleteMessage: (messageId: string) => Promise<void>;
}

export default function MessageCard({
  isYou,
  msg,
  handleDeleteMessage,
}: MessageCardProp) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`max-w-[70%] px-2 py-1 text-xs relative group ${
        isYou ? "bg-white text-black" : "bg-stone-900 text-stone-200"
      }`}
    >
      {msg.image && (
        <img
          src={msg.image.url}
          alt="sent"
          className="w-full max-h-64 object-cover mb-1"
        />
      )}
      {msg.text && <div>{msg.text}</div>}
      <div className="flex items-center justify-between gap-2 mt-1">
        <div className="text-xs text-stone-400">
          {formatTime(msg.createdAt)}
        </div>
        {isYou && (
          <button
            onClick={() => handleDeleteMessage(msg._id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-stone-800 rounded"
            title="Delete message"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </button>
        )}
      </div>
    </div>
  );
}
