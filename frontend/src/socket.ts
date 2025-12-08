import { io } from "socket.io-client";

export const socket = io("http://localhost:3000");

socket.on("notification:new", (notData) => {
  console.log("new notification:", notData);
});

socket.on("message:receive", (msg) => {
  console.log("New message:", msg);
});
