interface LogoutModalProp {
  setShowLogoutModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
}

export default function LogoutModal({
  setShowLogoutModal,
  handleLogout,
}: LogoutModalProp) {
  return (
    <div className="w-[90%] max-w-sm bg-stone-950 border border-stone-800 p-6 space-y-5">
      <h2 className="text-lg text-white font-medium">Log out?</h2>

      <p className="text-xs text-stone-400">
        Are you sure you want to log out of your account?
      </p>

      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={() => setShowLogoutModal(false)}
          className="px-4 py-2 text-xs border border-stone-700 text-stone-300 hover:bg-stone-900"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await handleLogout();
            setShowLogoutModal(false);
          }}
          className="px-4 py-2 text-xs bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
