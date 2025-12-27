import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Heart } from "lucide-react";
import { getPostById } from "../api/postApi";

interface PostData {
  uploadedBy: {
    username: string;
    profilePicture: {
      url: string;
    };
  };
  text: string;
  likes: [];
  image: {
    url: string;
  };
  createdAt: string;
}

export default function Post() {
  const { id } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getPostById(id).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-stone-200 flex items-center justify-center">
        Loading post...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-stone-200 flex items-center justify-center">
        Post not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-stone-200 pt-10">
      <div className="max-w-xl mx-auto px-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={post.uploadedBy.profilePicture.url}
            alt={post.uploadedBy.username}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold">{post.uploadedBy.username}</p>
            <p className="text-xs text-stone-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* POST IMAGE */}
        {post.image?.url && (
          <div className="mb-4 rounded-xl overflow-hidden bg-stone-900">
            <img
              src={post.image.url}
              alt="Post"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* POST TEXT */}
        <p className="text-[15px] leading-relaxed mb-4">{post.text}</p>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 text-stone-400">
          <Heart size={20} />
          <span className="text-sm">{post.likes.length}</span>
        </div>
      </div>
    </div>
  );
}
