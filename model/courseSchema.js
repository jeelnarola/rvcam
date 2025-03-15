import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        require:true,
        unique: true,
    }
})

export const Course = mongoose.model('Course',courseSchema)