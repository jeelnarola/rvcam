import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
    {
        faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true }, // Faculty ID
        leaveType: { type: String, enum: ["Sick", "Casual", "Annual", "Maternity", "Other"], required: true }, // Leave type
        startDate: { type: Date, required: true }, // Leave start date
        endDate: { type: Date, required: true }, // Leave end date
        reason: { type: String, required: true }, // Leave reason
        file:{type:String,},
        status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }, // Approval status
        appliedAt: { type: Date, default: Date.now }, // When the leave was applied
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Admin who approved/rejected
      },
      { timestamps: true }
)

export const Leave = mongoose.model('Levae',leaveSchema)