import { useEffect, useState, type ChangeEvent } from "react";
import {
  getMe,
  updateUsername,
  updateProfilePicture,
  updatePassword,
  deleteUser,
  updateBio,
} from "../api/userApi";
import ProfilePostCard from "../components/ProfilePostCard";
import { getUserPosts } from "../api/postApi";
import { useNavigate } from "react-router";
import { useAuthStore } from "../zustand/authStore";
import { useUIStore } from "../zustand/uiStore";
import ProfileSkeleton from "../components/ProfileSkeleton";
import ProfileHeader from "../components/ProfileHeader";
import Settings from "../components/Settings";

export interface ProfilePicture {
  url: string;
  publicId: string;
}

export interface User {
  _id: string;
  username: string;
  bio: string;
  profilePicture?: ProfilePicture;
}

export interface Post {
  _id: string;
  text?: string;
  likes?: [];
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

  // ---------------- BIO ----------------
  const [bio, setBio] = useState<string>("");
  const [editingBio, setEditingBio] = useState<boolean>(false);

  useEffect(() => {
    if (user) setBio(user.bio || "");
  }, [user]);

  const saveBio = async () => {
    if (!user) return;
    try {
      await updateBio(bio);
      setUser({ ...user, bio: bio });
      setEditingBio(false);
      showToast("Bio updated", "success");
    } catch {
      showToast("Failed to update bio", "error");
    }
  };

  // ---------------- UPDATE USERNAME ----------------
  const [newUsername, setNewUsername] = useState<string>("");
  const updateName = async () => {
    if (!user || !newUsername.trim()) return;

    setLoading(true);
    try {
      await updateUsername(newUsername);
      setUser({ ...user, username: newUsername.toLocaleLowerCase() });
      setNewUsername("");
      showToast("Username updated", "success");
    } catch {
      showToast("Failed to update username", "error");
    } finally {
      setLoading(false);
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
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // ---------------- PASSWORD ----------------
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const changePassword = async () => {
    if (!oldPassword || !newPassword) return;
    setLoading(true);
    try {
      await updatePassword({ password: oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      showToast("Password changed", "success");
    } catch {
      showToast("Failed to change password", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE ACCOUNT ----------------
  const removeAccount = async () => {
    if (
      !confirm("This action cannot be undone. All related data will be deleted")
    )
      return;

    setLoading(true);
    try {
      await deleteUser();
      clearAuth();
      showToast("Account deleted", "success");
      navigate("/", { replace: true });
    } catch {
      showToast("Failed to delete account", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-stone-200 px-6 md:px-14 pt-10 font-[Inter]">
      <ProfileHeader
        user={user}
        bio={bio}
        setBio={setBio}
        saveBio={saveBio}
        setEditingBio={setEditingBio}
        editingBio={editingBio}
      />

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
            <ProfilePostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* ---------- SETTINGS ---------- */}
      {tab === "settings" && (
        <Settings
          updateName={updateName}
          updatePic={updatePic}
          setNewPassword={setNewPassword}
          setNewUsername={setNewUsername}
          setOldPassword={setOldPassword}
          newPassword={newPassword}
          newUsername={newUsername}
          loading={loading}
          preview={preview}
          onPicChange={onPicChange}
          oldPassword={oldPassword}
          changePassword={changePassword}
          removeAccount={removeAccount}
        />
      )}
    </div>
  );
}
