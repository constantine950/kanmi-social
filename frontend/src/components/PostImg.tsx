import type { User } from "../types";

interface PostImgProp {
  uploadedBy: User;
  createdAt: string;
}

export default function PostImg({ uploadedBy, createdAt }: PostImgProp) {
  return (
    <div className="flex gap-3">
      <img
        src={uploadedBy?.profilePicture?.url || "/avatar.png"}
        className="w-8 h-8 rounded-full"
      />
      <div>
        <p className="text-sm font-medium text-white">
          {uploadedBy?.username || "Unknown"}
        </p>
        <p className="text-xs text-stone-500">
          {new Date(createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}{" "}
          at{" "}
          {new Date(createdAt).toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>
    </div>
  );
}
