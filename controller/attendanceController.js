import { Attendance } from "../model/attendanceSchema.js";

export const addAttendance = async (req, res) => {
    try {
        let { date, courseID, division, subjectId, facultyId, attendance } = req.body;
        if (!date || !courseID || !division || !subjectId || !facultyId) {
            return res.status(400).json({ success: false, error: "Attendance must have date,courseID,division,subjectId,facultyId" });
        }

        if (req.user && req.user.role == "Faculty") {
            const newAttendance = new Attendance({
                date, courseID, division, subjectId, facultyId, attendance
            })
            await newAttendance.save()
            res.status(201).json({ success: true, message: "Attendance Add successfully", user: newUser });
        } else {
            res.status(401).json({ success: false, message: "Unauthorized Page" });
        }
    } catch (error) {
        console.log(`Error By Attendance Controller Js For addAttendance`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const getAttendance = async (req, res) => {
    try {
        let { id } = req.body;

        const findAttendance = await Attendance.findById({ facultyId: id }).sort({ date: 1 });
        if (findAttendance.length == 0) {
            return res.status(404).json({ success: false, Message: "Attendance Not Found...!" })
        }
        return res.json({ message: "Attendance Get successfully", data: findAttendance });
    } catch (error) {
        console.log(`Error By Attendance Controller Js For getAttendance`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const updateAttendance = async (req, res) => {
    try {
        let { id } = req.params; // schema id

        const findAttendance = await Attendance.findOne(id)
        if (!findAttendance) {
            return res.status(404).json({ success: false, Message: "Attendance Not Found...!" })
        }

        const updatedAttendance = await Attendance.findByIdAndUpdate(
            id,
            { $set: req.body }, // Update with request body data
            { new: true } // Return updated document
            // courseID,division, subjectId,attendance,facultyId,
        );
        return res.status(200).json({ success: true, message: "Attendance Updated Successfully", data: updatedAttendance });
    } catch (error) {
        console.log(`Error By Attendance Controller Js For updateAttendance`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const deleteAttendance = async (req, res) => {
    try {
        const { ids } = req.body; // Array

        // Check if IDs exist
        const existingAttendance = await Attendance.find({ _id: { $in: ids } });

        if (existingAttendance.length === 0) {
            return res.status(404).json({ message: "No matching records found." });
        }

        if (req.user && req.user.role == "Faculty") {
            const result = await Attendance.deleteMany({ _id: { $in: ids } });
            return res.json({ message: "Deleted successfully", data:result });
        }else{
            res.status(401).json({ success: false, message: "Unauthorized Page" });
        }
    } catch (error) {
        console.log(`Error By Attendance Controller Js For deleteAttendance`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}