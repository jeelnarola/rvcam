import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        require:true,
        unique: true,
    },
    subject:[{
        type:String.mongoose.Types.ObjectId,
        ref:'Subject',
        require:true
    }] 
})

export const Course = mongoose.model('Course',courseSchema)