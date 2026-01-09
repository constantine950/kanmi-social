import type { ChangeEvent } from "react";

interface SettingsProp {
  newUsername: string;
  setNewUsername: (value: React.SetStateAction<string>) => void;
  updateName: () => Promise<void>;
  loading: false;
  preview: string | null;
  onPicChange: (e: ChangeEvent<HTMLInputElement>) => void;
  updatePic: () => Promise<void>;
  oldPassword: string;
  setOldPassword: (value: React.SetStateAction<string>) => void;
  newPassword: string;
  setNewPassword: (value: React.SetStateAction<string>) => void;
  changePassword: () => Promise<void>;
  removeAccount: () => Promise<void>;
}

export default function Settings({
  newUsername,
  setNewUsername,
  updateName,
  loading,
  preview,
  onPicChange,
  updatePic,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  changePassword,
  removeAccount,
}: SettingsProp) {
  return (
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
          {loading ? "Updating..." : "Update"}
        </button>
      </section>

      <section>
        <h3 className="text-sm mb-2">Change Profile Picture</h3>
        {preview && (
          <img src={preview} className="w-16 h-16 rounded-full mb-2" />
        )}
        <input type="file" onChange={onPicChange} />
        <button
          onClick={updatePic}
          className="mt-3 px-4 py-2 bg-white text-black text-sm"
        >
          {loading ? "Uploading..." : "Upload"}
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
          {loading ? "Updating..." : "Update"}
        </button>
      </section>

      <button
        onClick={removeAccount}
        className="w-full py-2 bg-red-600 text-white text-sm"
      >
        {loading ? "Deleting..." : "Delete Account"}
      </button>
    </div>
  );
}
