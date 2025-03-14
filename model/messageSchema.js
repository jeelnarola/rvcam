import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: [
        { type: String, required: true }
    ],
    // messageType: { type: String, enum: ["text", "image", "video", "audio", "file"], default: "text" }, // Message type
    fileUrl: { type: String, default: null },
    seen: { type: Boolean, default: false },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
},
    { timestamps: true }
)

export const Message = mongoose.model('Message',messageSchema)