import mongoose from "mongoose";
import { type } from "os";
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        require: true,
    },
    codeNumber: {
        type: Number
    },
    credits: {
        type: Number
    },
    facultyId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        }
    ],
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        require: true
    }
})
export const Subject = mongoose.model("Subject", subjectSchema)