import express from "express";
import connectDB from "./config/db.ts";
import authRoutes from "./routes/authRoutes.ts";

connectDB();
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
