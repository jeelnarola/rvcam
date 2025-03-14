import mongoose from "mongoose";
const librarySchema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
        unique:true
    },
    author:{
        type:String,
        require:true,
    },
    qty:{
        type:Number,
        require:true
    },
    addedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    }
})

export const Library = mongoose.model('Library',librarySchema)