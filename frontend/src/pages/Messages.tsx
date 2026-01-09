import { ArrowLeft, Trash2 } from "lucide-react";
import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useAuthStore } from "../zustand/authStore";
import { useUIStore } from "../zustand/uiStore";
import { socket } from "../socket";
import {
  sendMessage as sendMessageApi,
  getMessages as getMessagesApi,
  deleteMessage as deleteMessageApi,
  getAllUsers,
} from "../api/messageApi";
import { AxiosError } from "axios";

interface Message {
  _id: string;
  text?: string;
  sender: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  receiver: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  image?: {
    url: string;
    publicId: string;
  };
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  profilePicture?: string;
}

export default function Messages() {
  const { user } = useAuthStore();
  const { showToast } = useUIStore();

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

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
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767.98px)");
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();

        if (response.data.success) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
        const err = error as AxiosError<{ message: string }>;
        showToast(
          err.response?.data?.message || "Failed to load users",
          "error"
        );
      }
    };

    fetchUsers();
  }, [showToast]);

  // Socket listeners
  useEffect(() => {
    // Listen for incoming messages
    socket.on("message:receive", (message: Message) => {
      // Add to messages if chat is open with this user
      if (
        selectedUser &&
        (message.sender._id === selectedUser._id ||
          message.receiver._id === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Listen for sent message confirmation
    socket.on("message:sent", (message: Message) => {
      // Add to messages if chat is open
      if (
        selectedUser &&
        (message.sender._id === selectedUser._id ||
          message.receiver._id === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Listen for deleted messages
    socket.on("message:deleted", ({ messageId }: { messageId: string }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    return () => {
      socket.off("message:receive");
      socket.off("message:sent");
      socket.off("message:deleted");
    };
  }, [selectedUser]);

  const fetchMessages = async (userId: string) => {
    try {
      setLoading(true);
      const response = await getMessagesApi(userId);

      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      const err = error as AxiosError<{ message: string }>;
      showToast(
        err.response?.data?.message || "Failed to load messages",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (selectedUser: User) => {
    setSelectedUser(selectedUser);
    await fetchMessages(selectedUser._id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !imageFile) return;
    if (!selectedUser) return;

    try {
      setSendingMessage(true);

      const response = await sendMessageApi(
        selectedUser._id,
        newMessage.trim() || undefined,
        imageFile || undefined
      );

      if (response.data.success) {
        setNewMessage("");
        setImageFile(null);
        setImagePreview(null);
        // Message will be added via socket event
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const err = error as AxiosError<{ message: string }>;
      showToast(
        err.response?.data?.message || "Failed to send message",
        "error"
      );
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await deleteMessageApi(messageId);

      if (response.data.success) {
        // Message will be removed via socket event
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
      const err = error as AxiosError<{ message: string }>;
      showToast(
        err.response?.data?.message || "Failed to delete message",
        "error"
      );
    }
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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
              Select a user to start chatting
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

              {/* MESSAGES */}
              <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full text-stone-500">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-stone-500">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isYou = msg.sender._id === user?.user_id;
                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isYou ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] px-2 py-1 text-xs relative group ${
                            isYou
                              ? "bg-white text-black"
                              : "bg-stone-900 text-stone-200"
                          }`}
                        >
                          {msg.image && (
                            <img
                              src={msg.image.url}
                              alt="sent"
                              className="w-full max-h-64 object-cover mb-1"
                            />
                          )}
                          {msg.text && <div>{msg.text}</div>}
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <div className="text-xs text-stone-400">
                              {formatTime(msg.createdAt)}
                            </div>
                            {isYou && (
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-stone-800 rounded"
                                title="Delete message"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
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
                  onKeyDown={(e) =>
                    e.key === "Enter" && !sendingMessage && handleSendMessage()
                  }
                  disabled={sendingMessage}
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
                    disabled={sendingMessage}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={
                    sendingMessage || (!newMessage.trim() && !imageFile)
                  }
                  className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-stone-300 border border-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendingMessage ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
