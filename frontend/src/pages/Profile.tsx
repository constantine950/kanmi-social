import { useEffect, useState, type ChangeEvent } from "react";
import {
  getMe,
  updateUsername,
  updateProfilePicture,
  updatePassword,
  deleteUser,
} from "../api/userApi";
import ProfilePostCard from "../components/ProfilePostCard";
import { getUserPosts } from "../api/postApi";
import { useNavigate } from "react-router";
import { useAuthStore } from "../zustand/authStore";
import { useUIStore } from "../zustand/uiStore";

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

export interface Post {
  _id: string;
  text?: string;
  image?: {
    url: string;
  } | null;
  uploadedBy: User;
  createdAt: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<"posts" | "settings">("posts");

  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const showToast = useUIStore((s) => s.showToast);

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await getMe();
        const postsRes = await getUserPosts();
        setUser(userRes.data.data);
        setPosts(postsRes.data.data);
      } catch (err) {
        showToast("Failed to fetch profile", "error");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [showToast]);

  // ---------------- BIO (DUMMY) ----------------
  const [bio, setBio] = useState<string>("");
  const [editingBio, setEditingBio] = useState<boolean>(false);

  useEffect(() => {
    if (user) setBio(user.bio || "");
  }, [user]);

  const saveBio = () => {
    if (!user) return;
    setUser({ ...user, bio });
    setEditingBio(false);
    showToast("Bio updated", "success");
  };

  // ---------------- UPDATE USERNAME ----------------
  const [newUsername, setNewUsername] = useState<string>("");
  const updateName = async () => {
    if (!user || !newUsername.trim()) return;
    try {
      await updateUsername(newUsername);
      setUser({ ...user, username: newUsername });
      setNewUsername("");
      showToast("Username updated", "success");
    } catch {
      showToast("Failed to update username", "error");
    }
  };

  // ---------------- PROFILE PICTURE ----------------
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onPicChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const updatePic = async () => {
    if (!user || !file) return;
    try {
      const fd = new FormData();
      fd.append("profilePicture", file);
      const res = await updateProfilePicture(fd);
      setUser({ ...user, profilePicture: res.data.data });
      setFile(null);
      setPreview(null);
      showToast("Profile picture updated", "success");
    } catch {
      showToast("Failed to update profile picture", "error");
    }
  };

  // ---------------- PASSWORD ----------------
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const changePassword = async () => {
    if (!oldPassword || !newPassword) return;
    try {
      await updatePassword({ password: oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      showToast("Password changed", "success");
    } catch {
      showToast("Failed to change password", "error");
    }
  };

  // ---------------- DELETE ACCOUNT ----------------
  const removeAccount = async () => {
    if (!confirm("This action cannot be undone.")) return;
    try {
      await deleteUser();
      clearAuth();
      showToast("Account deleted", "success");
      navigate("/home", { replace: true });
    } catch {
      showToast("Failed to delete account", "error");
    }
  };

  // ---------------- POST ACTIONS ----------------
  const handleEditPost = (post: Post) => {
    alert(`Edit post: ${post._id}`);
    showToast("Post edit action triggered", "info");
  };

  const handleDeletePost = (postId: string) => {
    if (!confirm("Delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p._id !== postId));
    showToast("Post deleted", "success");
  };

  // ---------------- SKELETON ----------------
  if (loading) return <ProfileSkeleton />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-stone-200 px-6 md:px-14 pt-10 font-[Inter]">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-start gap-5 mb-10">
        <img
          src={user.profilePicture?.url || "/default-avatar.png"}
          className="w-24 h-24 rounded-full object-cover border border-stone-700"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-[Playfair_Display]">{user.username}</h1>

          {!editingBio ? (
            <p
              className="text-sm text-stone-400 mt-2 cursor-pointer"
              onClick={() => setEditingBio(true)}
            >
              {bio || "Click to add bio"}
            </p>
          ) : (
            <div className="mt-2 space-y-2">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 p-2 text-sm"
              />
              <button
                onClick={saveBio}
                className="text-xs px-3 py-1 bg-white text-black"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------- TABS ---------- */}
      <div className="flex gap-8 border-b border-stone-800 mb-8 text-sm">
        {(["posts", "settings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 ${
              tab === t
                ? "border-b-2 border-white text-white"
                : "text-stone-400"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ---------- POSTS (PostCards) ---------- */}
      {tab === "posts" && (
        <div className="space-y-4 max-w-2xl">
          {posts.length === 0 && (
            <p className="text-stone-500 text-sm">No posts yet</p>
          )}

          {posts.map((post) => (
            <ProfilePostCard
              key={post._id}
              post={post}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          ))}
        </div>
      )}

      {/* ---------- SETTINGS ---------- */}
      {tab === "settings" && (
        <div className="max-w-md space-y-8">
          <section>
            <h3 className="text-sm mb-2">Change Username</h3>
            <input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 px-3 py-2 text-sm"
            />
            <button
              onClick={updateName}
              className="mt-3 px-4 py-2 bg-white text-black text-sm"
            >
              Update
            </button>
          </section>

          <section>
            <h3 className="text-sm mb-2">Profile Picture</h3>
            {preview && (
              <img src={preview} className="w-16 h-16 rounded-full mb-2" />
            )}
            <input type="file" onChange={onPicChange} />
            <button
              onClick={updatePic}
              className="mt-3 px-4 py-2 bg-white text-black text-sm"
            >
              Upload
            </button>
          </section>

          <section>
            <h3 className="text-sm mb-2">Change Password</h3>
            <input
              type="password"
              placeholder="Old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 px-3 py-2 text-sm mb-2"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 px-3 py-2 text-sm"
            />
            <button
              onClick={changePassword}
              className="mt-3 px-4 py-2 bg-white text-black text-sm"
            >
              Update Password
            </button>
          </section>

          <button
            onClick={removeAccount}
            className="w-full py-2 bg-red-600 text-white text-sm"
          >
            Delete Account
          </button>
        </div>
      )}
    </div>
  );
}

/* ================== SKELETON ================== */
function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-black px-6 md:px-14 pt-10 animate-pulse">
      <div className="flex items-center gap-5 mb-10">
        <div className="w-24 h-24 bg-stone-800 rounded-full" />
        <div className="space-y-3">
          <div className="w-48 h-6 bg-stone-800" />
          <div className="w-64 h-4 bg-stone-800" />
        </div>
      </div>

      <div className="space-y-4 max-w-2xl">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-stone-800" />
        ))}
      </div>
    </div>
  );
}
