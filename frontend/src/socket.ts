import { io } from "socket.io-client";
import { useAuthStore } from "./zustand/authStore";
import { useUIStore } from "./zustand/uiStore";

export const socket = io("http://localhost:3000", {
  autoConnect: false,
});

let initialized = false;

export const initSocket = () => {
  console.log("🧠 initSocket called");

  if (initialized) return;

  const user = useAuthStore.getState().user;
  if (!user) return;

  socket.connect();

  socket.on("connect", () => {
    console.log("🟢 Connected:", socket.id);
    socket.emit("register", user.user_id);
  });

  socket.on("notification:new", (data) => {
    console.log(data);
    const showToast = useUIStore.getState().showToast;

    if (data.type === "like") {
      showToast("Someone liked your post ❤️", "info");
    }

    if (data.type === "comment") {
      showToast("Someone commented on your post 💬", "info");
    }
  });

  initialized = true;
};

export const disconnectSocket = () => {
  if (!initialized) return;

  socket.off("notification:new");
  socket.disconnect();
  initialized = false;
};
