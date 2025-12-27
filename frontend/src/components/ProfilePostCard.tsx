export interface Post {
  _id: string;
  text?: string;
  image?: {
    url: string;
  } | null;
  uploadedBy: User;
  createdAt: string;
  updatedAt?: string;
}

export interface ProfilePicture {
  url: string;
  publicId: string;
}

export interface User {
  _id: string;
  username: string;
  bio?: string;
  profilePicture?: ProfilePicture;
}

interface ProfilePostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export default function ProfilePostCard({
  post,
  onEdit,
  onDelete,
}: ProfilePostCardProps) {
  return (
    <div className="border border-stone-800 bg-stone-950 p-4 rounded-md">
      {/* POST CONTENT */}
      <p className="text-sm text-stone-200 whitespace-pre-wrap">{post.text}</p>

      {/* OPTIONAL IMAGE */}
      {post.image?.url && (
        <img
          src={post.image.url}
          alt="post"
          className="mt-3 w-full max-h-[420px] object-cover rounded"
        />
      )}

      {/* META */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-stone-500">
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-4 text-xs">
          <button
            onClick={() => onEdit(post)}
            className="text-blue-400 hover:underline"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(post._id)}
            className="text-red-400 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
