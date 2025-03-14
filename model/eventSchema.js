import mongoose, { mongo } from "mongoose";
const eventSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
        unique:true,
    },
    description:{
        type:String,
        require:true
    },
    date:{
        type:String,
        require:true,
    },
    location:{
        type:String,
        require:true,
    },
    organizedBy:{
        type:String,
        require:true
    },
    participate:[
        {
            name:{
                type:String,
                require:true,
                unique:true
            },
            courseId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Course',
                require:true
            },
            amoutPay:{
                type:Number,
                enum:['Pending','Completed'],
                default:'Pending'
            }
        }
    ]
})

export const Event = mongoose.model("Event",eventSchema)
