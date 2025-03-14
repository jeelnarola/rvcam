import mongoose, { mongo } from "mongoose";

const feesSchema = new mongoose.Schema(
    {
        studentId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'',
            require:true,
        },
        courseId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'',
            require:true,
        },
        semester:{
            type:number,
            ref:'',
            require:true,
        },
        amount:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'',
            require:true
        },
        dueDate:{
            type:Date.now(),
            require:true
        },
        status:{
            type:String,
            enum:['Pending','Completed'],
            default:'Pending'
        },
    },
)

export const Fees = mongoose.model("Fees",feesSchema)