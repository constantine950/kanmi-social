import { Server } from "socket.io";

let io: Server;
export const onlineUsers = new Map(); // 👈 available everywhere

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User registered: ${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      for (const [userId, id] of onlineUsers.entries()) {
        if (id === socket.id) onlineUsers.delete(userId);
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized yet!");
  }
  return io;
};
