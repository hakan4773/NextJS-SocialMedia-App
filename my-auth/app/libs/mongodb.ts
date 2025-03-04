import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB connected");
  };

export default connectDB;