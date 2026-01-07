import { io } from "socket.io-client";
import { useAuthStore } from "./zustand/authStore";
import { useUIStore } from "./zustand/uiStore";

export const socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
  {
    autoConnect: false,
  }
);

let initialized = false;

export const initSocket = () => {
  if (initialized) return;

  const user = useAuthStore.getState().user;
  if (!user) return;

  socket.connect();

  socket.on("connect", () => {
    console.log("🟢 Connected:", socket.id);
    socket.emit("register", user.user_id);
  });

  // 🔔 Notifications (recipient only)
  socket.on("notification:new", (notif) => {
    const showToast = useUIStore.getState().showToast;
    showToast(notif.message, "info");
  });

  // ⚡ Actor feedback
  socket.on("toast:feedback", ({ message }) => {
    const showToast = useUIStore.getState().showToast;
    showToast(message, "info");
  });

  initialized = true;
};

export const disconnectSocket = () => {
  if (!initialized) return;

  socket.off("notification:new");
  socket.off("toast:feedback");
  socket.disconnect();
  initialized = false;
};
