import { Course } from "../model/courseSchema.js";

export const addCourse = async (req, res) => {
    try {
        let { courseName } = req.body

        const findCourse = await Course.findOne({ courseName })
        if (findCourse) {
            return res.status(200).json({ success: true, message: "alrday Extis Course" })
        }

        if (req.user && req.user.role == "Admin") {
            const createCourse = await Course.create({ courseName })
            return res.status(201).json({ success: true, message: "Course Add SuccessFully..." })
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized Page" });
        }

    } catch (error) {
        console.log(`Error By Course Controller Js For addCourse`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const getCourse = async (req, res) => {
    try {
        const getCourse = await Course.find()
        res.status(201).json({ success: true, data: getCourse })
    } catch (error) {
        console.log(`Error By Course Controller Js For getCourse`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const updateCourse = async (req, res) => {
    try {
        let { id } = req.params
        let { courseName } = req.body
        const findCourse = await Course.findById(id)
        if (!findCourse) {
            return res.status(404).json({ success: false, message: "No Data Found.." })
        }
        if (req.user && req.user.role == "Admin") {
            let Course = await Course.findByIdAndUpdate({ id, courseName })
            return res.status(201).json({ success: true, message: "Update Course SuccessFully...", data: Course })
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized Page" });
        }


    } catch (error) {
        console.log(`Error By Course Controller Js For updateCourse`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const deleteCourse = async (req, res) => {
    try {

        const { ids } = req.body; // Array

        // Check if IDs exist
        const existingUsers = await Course.find({ _id: { $in: ids } });

        if (existingUsers.length === 0) {
            return res.status(404).json({ message: "No matching records found." });
        }
        if(req.user && req.user.role == "Admin"){
            const result = await Course.deleteMany({ _id: { $in: ids } });
        return res.json({ message: "Deleted successfully", data: result });
        }else{
            return res.status(401).json({ success: false, message: "Unauthorized Page" });
        }
        // Delete records
        
    } catch (error) {
        console.log(`Error By Course Controller Js For deleteCourse`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}