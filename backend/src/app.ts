import express from "express";
import connectDB from "./config/db.ts";
import authRoutes from "./routes/authRoutes.ts";
import errorHandler from "./middlewares/errorHandler.ts";

connectDB();
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
