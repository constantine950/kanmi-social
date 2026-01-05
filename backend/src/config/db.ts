import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_DB_URI;
    if (!uri) throw new Error("MONGO_DB_URI not found");

    await mongoose.connect(uri, {
      family: 4,
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB not connected", error);
    process.exit(1);
  }
};

export default connectDB;
