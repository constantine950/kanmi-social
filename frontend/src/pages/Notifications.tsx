import { useState } from "react";

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  unread: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Follower",
      description: "Alice started following you.",
      time: "2h ago",
      unread: true,
    },
    {
      id: 2,
      title: "Post Liked",
      description: "Bob liked your post.",
      time: "4h ago",
      unread: false,
    },
    {
      id: 3,
      title: "Comment",
      description: "Charlie commented: Nice post!",
      time: "1d ago",
      unread: true,
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, unread: false }))
    );
  };

  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] flex flex-col items-center justify-start pt-16 px-4 md:px-14">
      {/* Container for header and items */}
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

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`
                border border-stone-800 p-4 rounded-md flex flex-col
                ${
                  notif.unread
                    ? "bg-stone-900 border-l-4 border-blue-500"
                    : "bg-stone-950"
                }
              `}
            >
              <span className="font-medium text-white">{notif.title}</span>
              <span className="text-sm text-stone-400">
                {notif.description}
              </span>
              <span className="text-xs text-stone-500 mt-1">{notif.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
