import mongoose from "mongoose";
const resultSchema = new mongoose.Schema({
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    exameType:{
        type:String,
        require:true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        require:true
    },
    marks:[
        {
            subjectName:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Subject',
                require:true,
                unique:true,
            },
            optinMark:{
                type:Number,
                require:true
            }
        }
    ]
})

export const Result = mongoose.model('Result',resultSchema)