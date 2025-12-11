import { useState, type ChangeEvent } from "react";
import { useParams } from "react-router";

export default function Profile() {
  const { username } = useParams();

  // Mock profile data
  const [profilePic, setProfilePic] = useState("/mock/default-profile.jpg");
  const [currentUsername, setCurrentUsername] = useState(username || "");
  const [bio, setBio] = useState(`Hi, I'm ${username}! Welcome to my profile.`);

  // Mock posts
  const posts = [
    "/cabin-001.jpg",
    "/mock/post2.jpg",
    "/mock/post3.jpg",
    "/mock/post4.jpg",
    "/mock/post5.jpg",
    "/mock/post6.jpg",
  ];

  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  // --- Status Messages ---
  const [usernameMsg, setUsernameMsg] = useState<string | null>(null);
  const [profilePicMsg, setProfilePicMsg] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<string | null>(null);

  // --- Update Username ---
  const [newUsername, setNewUsername] = useState("");
  const handleUpdateUsername = () => {
    if (!newUsername.trim()) return;
    // TODO: call your username endpoint here
    setCurrentUsername(newUsername);
    setUsernameMsg("Username updated successfully!");
    setNewUsername("");
    setTimeout(() => setUsernameMsg(null), 3000);
  };

  // --- Update Profile Picture ---
  const [newProfilePicFile, setNewProfilePicFile] = useState<File | null>(null);
  const [previewPic, setPreviewPic] = useState<string | null>(null);

  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfilePicFile(e.target.files[0]);
      setPreviewPic(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateProfilePic = () => {
    if (!previewPic) return;
    // TODO: call your profile picture endpoint here
    setProfilePic(previewPic);
    setProfilePicMsg("Profile picture updated successfully!");
    setPreviewPic(null);
    setNewProfilePicFile(null);
    setTimeout(() => setProfilePicMsg(null), 3000);
  };

  // --- Update Password ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = () => {
    if (!oldPassword || !newPassword) return;
    // TODO: call your password endpoint here
    setPasswordMsg("Password updated successfully!");
    setOldPassword("");
    setNewPassword("");
    setTimeout(() => setPasswordMsg(null), 3000);
  };

  // --- Delete Account ---
  const handleDeleteAccount = () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      // TODO: call your delete account endpoint here
      setDeleteMsg("Account deleted successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] px-6 md:px-14 pt-8 pb-8">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={profilePic}
          alt={currentUsername}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-stone-700 object-cover"
        />
        <div>
          <h1 className="text-2xl md:text-3xl font-[Playfair_Display]">
            {currentUsername}
          </h1>
          <p className="text-sm text-stone-400 mt-1 max-w-md">{bio}</p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {posts.map((postUrl, i) => (
          <div
            key={i}
            className="border border-stone-800 bg-stone-950 h-32 overflow-hidden relative group cursor-pointer"
            onClick={() => setSelectedPost(postUrl)}
          >
            <img
              src={postUrl}
              alt={`Post ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-semibold">
              Post #{i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* --- Update Username --- */}
      <div className="border border-stone-800 bg-stone-950 p-6 mb-6 space-y-4">
        <h2 className="text-lg font-semibold mb-2">Update Username</h2>
        <input
          type="text"
          placeholder="New username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 text-sm text-stone-200"
        />
        <button
          onClick={handleUpdateUsername}
          className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-stone-300 border border-stone-800"
        >
          Update Username
        </button>
        {usernameMsg && <p className="text-sm text-green-500">{usernameMsg}</p>}
      </div>

      {/* --- Update Profile Picture --- */}
      <div className="border border-stone-800 bg-stone-950 p-6 mb-6 space-y-4">
        <h2 className="text-lg font-semibold mb-2">Update Profile Picture</h2>
        <div className="flex items-center gap-4">
          {previewPic && (
            <img
              src={previewPic}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-full border border-stone-700"
            />
          )}
          <label className="px-3 py-2 border border-stone-800 bg-stone-900 text-sm cursor-pointer hover:bg-stone-800">
            Upload new profile picture
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </label>
        </div>
        <button
          onClick={handleUpdateProfilePic}
          className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-stone-300 border border-stone-800"
        >
          Update Profile Picture
        </button>
        {profilePicMsg && (
          <p className="text-sm text-green-500">{profilePicMsg}</p>
        )}
      </div>

      {/* --- Update Password --- */}
      <div className="border border-stone-800 bg-stone-950 p-6 mb-6 space-y-4">
        <h2 className="text-lg font-semibold mb-2">Update Password</h2>
        <input
          type="password"
          placeholder="Old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 text-sm text-stone-200"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 bg-stone-900 border border-stone-800 text-sm text-stone-200"
        />
        <button
          onClick={handleUpdatePassword}
          className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-stone-300 border border-stone-800"
        >
          Update Password
        </button>
        {passwordMsg && <p className="text-sm text-green-500">{passwordMsg}</p>}
      </div>

      {/* --- Delete Account --- */}
      <div className="border border-stone-800 bg-red-950 p-6">
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-500 border border-stone-800 w-full"
        >
          Delete Account
        </button>
        {deleteMsg && (
          <p className="text-sm text-green-500 mt-2">{deleteMsg}</p>
        )}
      </div>

      {/* --- Post Modal --- */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedPost(null)}
        >
          <img
            src={selectedPost}
            alt="Selected post"
            className="max-h-[80%] max-w-[80%] object-contain"
          />
        </div>
      )}
    </div>
  );
}
