import mongoose from "mongoose";
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
    },
    semester: {
        type: String,
        enum: ['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6'],
        require: true
    },
})
export const Subject = mongoose.model("Subject", subjectSchema)