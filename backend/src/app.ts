import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.ts";
import authRoutes from "./routes/authRoutes.ts";
import errorHandler from "./middlewares/errorHandler.ts";
import userRoutes from "./routes/userRoutes.ts";
import postRoutes from "./routes/postRoutes.ts";
import commentRoutes from "./routes/commentRoutes.ts";

connectDB();
export const app = express();

app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
