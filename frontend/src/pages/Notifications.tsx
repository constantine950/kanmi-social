import { useEffect, useState } from "react";
import {
  getNotificationsApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
} from "../api/notificationApi";
import { socket } from "../socket";
import { useUIStore } from "../zustand/uiStore";

interface Notification {
  _id: string;
  type: "like" | "comment" | string;
  message: string;
  read: boolean;
  sender: {
    username: string;
    profilePicture?: { url: string };
  };
  postId?: string;
  createdAt: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const data = await getNotificationsApi();
      setNotifications(data);
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    socket.on("notification:new", (notif: Notification) => {
      setNotifications((prev) => [notif, ...prev]);
      showToast(
        notif.type === "like"
          ? "Someone liked your post ❤️"
          : "Someone commented on your post 💬",
        "info"
      );
    });

    return () => {
      socket.off("notification:new");
    };
  }, [showToast]);

  const markAsRead = async (id: string) => {
    await markNotificationAsReadApi(id);
    setNotifications((prev) =>
      prev.map((notif) => (notif._id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = async () => {
    await markAllNotificationsAsReadApi();
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] flex flex-col items-center justify-start pt-16 px-4 md:px-14">
      <div className="w-full max-w-xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-[Playfair_Display]">
            Notifications
          </h1>
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-500 hover:underline"
          >
            Mark all as read
          </button>
        </div>

        {loading ? (
          <p className="text-center text-stone-400">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center text-stone-400">No notifications</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => markAsRead(notif._id)}
                className={`cursor-pointer border border-stone-800 p-4 rounded-md flex gap-3 items-center
                  ${
                    notif.read
                      ? "bg-stone-950"
                      : "bg-stone-900 border-l-4 border-blue-500"
                  }
                `}
              >
                <img
                  src={
                    notif.sender.profilePicture?.url ||
                    "/avatar-placeholder.png"
                  }
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 flex flex-col">
                  <span className="font-medium text-white">
                    {notif.sender.username}
                  </span>
                  <span className="text-sm text-stone-400">
                    {notif.message}
                  </span>
                  <span className="text-xs text-stone-500 mt-1">
                    {new Date(notif.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(notif.createdAt).toLocaleTimeString(undefined, {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
