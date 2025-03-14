const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Notice title
    description: { type: String, required: true }, // Notice content
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // Admin/Faculty who issued the notice
    audience: { type: String, enum: ["All", "Faculty", "Students", "Staff"], default: "All" }, // Target audience
    issuedAt: { type: Date, default: Date.now }, // When the notice was issued
    expiryDate: { type: Date, default: null }, // Notice expiry date (optional)
    isActive: { type: Boolean, default: true }, // Status of the notice
    sendDate:{type:Date,}
  },
  { timestamps: true }
);

export const Notice = mongoose.model("Notice", noticeSchema);