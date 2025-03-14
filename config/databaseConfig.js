import mongoose from "mongoose";
import 'dotenv/config'
export const Database = async()=>{
    await mongoose.connect(process.env.mongodb_url)
    console.log('Database Connect...');
}