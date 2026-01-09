interface User {
  _id: string;
  username: string;
  profilePicture?: string;
}

interface UserListProp {
  isMobile: boolean;
  selectedUser: User | null;
  users: User[];
  handleUserSelect: (selectedUser: User) => Promise<void>;
}

export default function UsersList({
  isMobile,
  selectedUser,
  users,
  handleUserSelect,
}: UserListProp) {
  return (
    <div
      className={`
            w-full md:w-80 h-full border border-stone-800 bg-stone-950 overflow-y-auto
            ${isMobile && selectedUser ? "hidden" : "block"}
          `}
    >
      {users.length === 0 ? (
        <div className="flex items-center justify-center h-full text-stone-500 text-sm">
          No users available
        </div>
      ) : (
        users.map((chatUser) => (
          <div
            key={chatUser._id}
            className={`flex items-center gap-3 p-3 cursor-pointer border-b border-stone-800 hover:bg-stone-900 ${
              selectedUser?._id === chatUser._id ? "bg-stone-900" : ""
            }`}
            onClick={() => handleUserSelect(chatUser)}
          >
            <img
              src={chatUser.profilePicture || "/default-avatar.png"}
              alt={chatUser.username}
              className="w-10 h-10 border border-stone-700 object-cover rounded-full"
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-white">
                {chatUser.username}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
