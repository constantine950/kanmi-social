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
import UsersList from "../components/UsersList";
import MessageHeader from "../components/MessageHeader";
import MessageCard from "../components/MessageCard";
import MessageInput from "../components/MessageInput";

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

  return (
    <div className="w-full h-screen bg-black text-stone-200 font-[Inter] overflow-hidden">
      <div className="h-full flex gap-4 w-full md:max-w-[960px] mx-auto">
        {/* USERS LIST */}
        <UsersList
          users={users}
          isMobile={isMobile}
          handleUserSelect={handleUserSelect}
          selectedUser={selectedUser}
        />

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
              <MessageHeader
                isMobile={isMobile}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />

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
                        <MessageCard
                          isYou={isYou}
                          handleDeleteMessage={handleDeleteMessage}
                          msg={msg}
                        />
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <MessageInput
                removeImage={removeImage}
                imageFile={imageFile}
                imagePreview={imagePreview}
                handleImageChange={handleImageChange}
                handleSendMessage={handleSendMessage}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendingMessage={sendingMessage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
