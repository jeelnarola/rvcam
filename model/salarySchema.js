import mongoose from "mongoose";
const salarySchema = new mongoose.Schema({
    facultyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'',
        require:true
    },
    date:{
        type:Date.now(),
        require:true,
    },
    amout:{
        type:Number,
        require:true
    },
    semesterPaid:{
        type:Number,
        require:true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'',
        require:true
    },
    status:{
        type:String,
        enum:['Pending','Completed'],
        default:'Pending'
    },
})

export const Salary = mongoose.model('Salary',salarySchema)