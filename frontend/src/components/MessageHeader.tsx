import { ArrowLeft } from "lucide-react";

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
}

interface MessageHeaderProp {
  isMobile: boolean;
  setSelectedUser: (value: React.SetStateAction<User | null>) => void;
  selectedUser: User;
}

export default function MessageHeader({
  isMobile,
  setSelectedUser,
  selectedUser,
}: MessageHeaderProp) {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-stone-800 shrink-0">
      {isMobile && (
        <button
          onClick={() => setSelectedUser(null)}
          className="text-stone-300 p-2 border border-stone-700 bg-stone-900 hover:bg-stone-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <img
        src={selectedUser.profilePicture || "/default-avatar.png"}
        alt={selectedUser.username}
        className="w-10 h-10 border border-stone-700 object-cover rounded-full"
      />
      <div>
        <span className="text-sm font-medium text-white">
          {selectedUser.username}
        </span>
      </div>
    </div>
  );
}
