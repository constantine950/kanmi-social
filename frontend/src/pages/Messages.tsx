import { useState, type ChangeEvent } from "react";

interface Message {
  text?: string;
  sender: "you" | "other";
  time: string;
  image?: string;
}

interface User {
  id: number;
  username: string;
  profilePic: string;
  lastMessage: string;
  unread: number;
  messages: Message[];
}

export default function Messages() {
  const users: User[] = [
    {
      id: 1,
      username: "alice",
      profilePic: "/mock/alice.jpg",
      lastMessage: "See you tomorrow!",
      unread: 2,
      messages: [
        { text: "Hey there!", sender: "other", time: "10:00 AM" },
        { text: "Hello!", sender: "you", time: "10:01 AM" },
        { text: "See you tomorrow!", sender: "other", time: "10:02 AM" },
      ],
    },
    {
      id: 2,
      username: "bob",
      profilePic: "/mock/bob.jpg",
      lastMessage: "Got it, thanks!",
      unread: 0,
      messages: [
        {
          text: "Can you send me that file?",
          sender: "other",
          time: "9:00 AM",
        },
        { text: "Got it, thanks!", sender: "you", time: "9:05 AM" },
      ],
    },
  ];

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !imageFile) return;
    if (!selectedUser) return;

    let imageUrl: string | undefined;
    if (imageFile) {
      imageUrl = imagePreview!;
    }

    selectedUser.messages.push({
      text: newMessage || undefined,
      sender: "you",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      image: imageUrl,
    });

    setNewMessage("");
    setImageFile(null);
    setImagePreview(null);
    setSelectedUser({ ...selectedUser }); // force re-render
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] px-6 md:px-14 pt-8 flex flex-col md:flex-row gap-4">
      {/* USERS LIST */}
      {(!selectedUser || window.innerWidth >= 768) && (
        <div className="w-full md:w-80 border border-stone-800 bg-stone-950 rounded-md overflow-y-auto max-h-[80vh]">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 cursor-pointer border-b border-stone-800 hover:bg-stone-900 ${
                selectedUser?.id === user.id ? "bg-stone-900" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              <img
                src={user.profilePic}
                alt={user.username}
                className="w-10 h-10 rounded-full border border-stone-700 object-cover"
              />
              <div className="flex-1 flex flex-col">
                <span className="text-sm font-medium text-white">
                  {user.username}
                </span>
                <span className="text-xs text-stone-400 truncate">
                  {user.lastMessage}
                </span>
              </div>
              {user.unread > 0 && (
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                  {user.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CHAT WINDOW */}
      {selectedUser && (
        <div className="flex-1 border border-stone-800 bg-black rounded-md flex flex-col max-h-[80vh]">
          {/* MOBILE BACK BUTTON */}
          <div className="md:hidden flex items-center p-4 border-b border-stone-800">
            <button
              onClick={() => setSelectedUser(null)}
              className="text-stone-400 px-2 py-1 bg-stone-900 rounded-md"
            >
              ← Back
            </button>
            <span className="ml-4 font-medium text-white">
              {selectedUser.username}
            </span>
          </div>

          {/* CHAT HEADER (desktop only) */}
          <div className="hidden md:flex items-center gap-3 p-4 border-b border-stone-800">
            <img
              src={selectedUser.profilePic}
              alt={selectedUser.username}
              className="w-10 h-10 rounded-full border border-stone-700 object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {selectedUser.username}
              </span>
              <span className="text-xs text-stone-400">Active now</span>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {selectedUser.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "you" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-3 py-2 rounded-md text-sm ${
                    msg.sender === "you"
                      ? "bg-white text-black"
                      : "bg-stone-900 text-stone-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="sent"
                      className="w-full max-h-64 object-cover mb-1 rounded-md"
                    />
                  )}
                  {msg.text && <div>{msg.text}</div>}
                  <div className="text-xs text-stone-400 mt-1 text-right">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SEND MESSAGE */}
          <div className="p-4 border-t border-stone-800 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 text-sm text-stone-200 focus:outline-none rounded-md"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <div className="flex items-center gap-2">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-md border border-stone-700"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-stone-200"
              />
            </div>
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-stone-300 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
