import { Notice } from "../model/noticeSchema.js";

export const sendNoticesAfterDate = async (req,res) => {
    try {
        const now = new Date();
        const dueNotices = await Notice.find({
            issuedAt: { $lte: now.toISOString().split("T")[0]},
            isNoticeSent: false
        });
        for (const notice of dueNotices) {
            // Mark as sent
            notice.isNoticeSent = true;
            notice.isStatus = "Completed"
            await notice.save();
        }
    } catch (error) {
        console.log(`Error By util For sendNoticesAfterDate`, error);
        res.status(500).json({ msg: 'Internal  Error.', Error: error })
    }
}

