import express from "express";
import http from "http";
import cors from "cors";
import connectDB from "./config/db.ts";
import authRoutes from "./routes/authRoutes.ts";
import errorHandler from "./middlewares/errorHandler.ts";
import userRoutes from "./routes/userRoutes.ts";
import postRoutes from "./routes/postRoutes.ts";
import commentRoutes from "./routes/commentRoutes.ts";
import notificationRoutes from "./routes/notificationRoutes.ts";
import { initSocket } from "./socket.ts";
import messageRoutes from "./routes/messageRoutes.ts";

connectDB();

const app = express();

//enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Create HTTP server for socket.io
const server = http.createServer(app);

// Initialize socket here AFTER server is created
initSocket(server);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/message", messageRoutes);

// ERROR HANDLER
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
