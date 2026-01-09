export interface User {
  _id: string;
  username: string;
  bio: string;
  profilePicture?: ProfilePicture;
}

export interface ProfilePicture {
  url: string;
  publicId: string;
}

interface ProfileHeaderProp {
  user: User;
  editingBio: boolean;
  setEditingBio: (value: React.SetStateAction<boolean>) => void;
  bio: string;
  setBio: (value: React.SetStateAction<string>) => void;
  saveBio: () => Promise<void>;
}

export default function ProfileHeader({
  user,
  editingBio,
  setEditingBio,
  bio,
  setBio,
  saveBio,
}: ProfileHeaderProp) {
  return (
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
            <div className="flex space-x-1.5">
              <button
                onClick={saveBio}
                className="text-xs px-3 py-1 bg-white text-black"
              >
                Save
              </button>
              <button
                onClick={() => setEditingBio(false)}
                className="text-xs px-3 py-1 bg-white text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
