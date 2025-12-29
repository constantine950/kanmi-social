import { Heart } from "lucide-react";
import type { User } from "../types";

interface ProfilePostCardProps {
  post: {
    _id: string;
    text?: string;
    likes?: [];
    image?: {
      url: string;
    } | null;
    uploadedBy: User;
    createdAt: string;
  };
}

export default function ProfilePostCard({ post }: ProfilePostCardProps) {
  const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;

  return (
    <div className="border border-stone-800 bg-stone-950 p-4 rounded-md">
      {/* POST TEXT */}
      {post.text && (
        <p className="text-sm text-stone-200 whitespace-pre-wrap">
          {post.text}
        </p>
      )}

      {/* POST IMAGE */}
      {post.image?.url && (
        <img
          src={post.image.url}
          alt="post"
          className="mt-3 w-full max-h-[420px] object-cover rounded"
        />
      )}

      {/* META */}
      <div className="flex items-center justify-between mt-4">
        {/* DATE */}
        <p className="text-xs text-stone-500">
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        {/* LIKES */}
        <div className="flex items-center gap-1 text-xs text-stone-400">
          <Heart fill="red" size={14} className="stroke-stone-400" />
          <span>{likesCount}</span>
        </div>
      </div>
    </div>
  );
}
