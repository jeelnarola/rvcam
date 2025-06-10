import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Notice title
    description: { type: String, required: true }, // Notice content
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, // Admin/Faculty who issued the notice
    audience: { type: String, enum: ["All", "Faculty", "Students", "Staff"], default: "All" }, // Target audience
    issuedAt: {
      type: Date, default: () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // ✅ correct way to strip time
  }
    }, 
    isNoticeSent: { type: Boolean, default: false }, // Status of the notice
      isStatus: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Completed"]
      }
    },
  { timestamps: true }
);
noticeSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.issuedAt) {
      ret.issuedAt = ret.issuedAt.toISOString().split("T")[0];
    }
    return ret;
  }
});
export const Notice = mongoose.model("Notice", noticeSchema);