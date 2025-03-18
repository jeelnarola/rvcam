import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    date :{
        type:String,
        require:true,
        default : Date.now(),
    },
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        require:true
    },
    division:{
        type:Number,
        require:true
    },
    subjectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subject',
        require:true
    },
    attendance:[
        {
            studentAttendance:[{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                enum:['Present','Absent']
            }
            ]
        }
    ],
    facultyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Faculty',
        require:true
    }
})

export const Attendance = mongoose.model('Attendance',attendanceSchema)