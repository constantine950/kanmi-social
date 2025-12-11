import { ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef, type ChangeEvent } from "react";

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

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767.98px)").matches
      : false
  );

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedUser?.messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767.98px)");
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !imageFile) return;
    if (!selectedUser) return;

    const imageUrl: string | undefined = imagePreview || undefined;

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

    setSelectedUser({ ...selectedUser });
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
    <div className="w-full h-screen bg-black text-stone-200 font-[Inter] overflow-hidden">
      <div className="h-full flex gap-4 w-full md:max-w-[960px] mx-auto">
        {/* USERS LIST */}
        <div
          className={`
            w-full md:w-80 h-full border border-stone-800 bg-stone-950 overflow-y-auto
            ${isMobile && selectedUser ? "hidden" : "block"}
          `}
        >
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
                className="w-10 h-10 border border-stone-700 object-cover rounded-full"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-white">
                  {user.username}
                </span>
                <span className="text-xs text-stone-400 block truncate">
                  {user.lastMessage}
                </span>
              </div>
              {user.unread > 0 && (
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 border border-stone-700">
                  {user.unread}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* CHAT WINDOW */}
        <div
          className={`
            grow md:grow-0 md:basis-[560px] h-full flex flex-col
            border border-stone-800 bg-black overflow-hidden
            ${isMobile && !selectedUser ? "hidden" : "flex"}
          `}
        >
          {!selectedUser ? (
            <div className="flex-1 flex items-center justify-center text-stone-500">
              Select a conversation
            </div>
          ) : (
            <>
              {/* HEADER */}
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
                  src={selectedUser.profilePic}
                  alt={selectedUser.username}
                  className="w-10 h-10 border border-stone-700 object-cover rounded-full"
                />
                <div>
                  <span className="text-sm font-medium text-white">
                    {selectedUser.username}
                  </span>
                  <div className="text-xs text-stone-400">Active now</div>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {selectedUser.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.sender === "you" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-2 py-1 text-xs ${
                        msg.sender === "you"
                          ? "bg-white text-black"
                          : "bg-stone-900 text-stone-200"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="sent"
                          className="w-full max-h-64 object-cover mb-1"
                        />
                      )}
                      {msg.text && <div>{msg.text}</div>}
                      <div className="text-xs text-stone-400 mt-1 text-right">
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <div className="p-3 border-t border-stone-800 flex flex-col md:flex-row gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-stone-900 border border-stone-800 text-sm text-stone-200"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <div className="flex items-center gap-2">
                  {imagePreview && (
                    <div className="flex items-center gap-2 border border-stone-700 bg-stone-950 p-1">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-8 h-8 object-cover border border-stone-700"
                      />
                      <button
                        onClick={removeImage}
                        className="w-8 h-8 grid place-items-center border border-stone-700 bg-stone-900 text-stone-200 text-xs"
                      >
                        ✖
                      </button>
                    </div>
                  )}
                  <label
                    htmlFor="chatImage"
                    className="inline-flex items-center gap-2 px-3 py-2 border border-stone-800 bg-stone-900 text-stone-200 text-sm cursor-pointer hover:bg-stone-800"
                  >
                    Attach image
                  </label>
                  <input
                    id="chatImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-stone-300 border border-stone-800"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
