import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dataBase = async () => {
  try {
    await mongoose.connect("mongodb+srv://rvcam:rvcam@collegemanagment.ep7gkr0.mongodb.net/rvcam?retryWrites=true&w=majority&appName=collegeManagment");
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
  }
};

export default dataBase;
