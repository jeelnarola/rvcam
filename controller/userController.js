import { User } from "../model/userSchema.js";
import { sendMail } from "../util/emailMessageSend.js";

export const addSF = async (req, res) => {
    try {
        let { role, SID, enrollmentNumber, courseId, semester, division, HODId, subjects, email, ...commonFields } = req.body
        const user = await User.findOne({ $or: [{ email }, { SID }] })
        if (!user) {
            return res.status(404).json({ success: false, Message: "User Not Found...!" })
        }
        if (req.user && req.user.role == "Admin") {
            if (role == 'Student') {
                if (!enrollmentNumber || !courseId || !semester || !division || !SID) {
                    return res.status(400).json({ success: false, error: "Student must have enrollmentNumber, courseId, division, SID and semester" });
                } else if (role === "Faculty") {
                    if (!HODId || !subjects || subjects.length === 0) {
                        return res.status(400).json({ success: false, error: "Faculty must have HODId and at least one subject" });
                    }
                }
            }
            const newUser = new User({
                ...commonFields,
                role,
                SID: role === "Student" ? SID : null,
                enrollmentNumber: role === "Student" ? enrollmentNumber : null,
                courseId,
                semester,
                HODId: role === "Faculty" ? HODId : null,
                subjects: role === "Faculty" ? subjects : [],
            });
            await newUser.save();
            sendMail(req.body.email)
            res.status(201).json({ success: true, message: "User created successfully", user: newUser });
        } else {
            res.status(401).json({ success: false, message: "Unauthorized Page" });
        }
    } catch (error) {
        console.log(`Error By user Controller Js For addFS`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const getSF = async (req, res) => {
    try {
        let { page, limit, role, name, SID, courseId, semester, division } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        let skip = (page - 1) * limit;
        let searchFilter;
        searchFilter = {
            $or: [
                { role: { $regex: role, $options: "i" } }, // Case-insensitive name search
                { name: { $regex: name, $options: "i" } },
                { SID: { $regex: SID, $options: "i" } },
                { courseId: { $regex: courseId, $options: "i" } },
                { semester: { $regex: semester, $options: "i" } },
                { division: { $regex: division, $options: "i" } }
            ]
        };
        const findUser = await User.find(searchFilter).skip(skip).limit(limit);
        const totalFind = await User.countDocuments(searchFilter);
        res.status(200).json({
            success: true,
            findUser,
            pagination: {
                currentPage: page,
                totalFind,
                totalPages: Math.ceil(totalStudents / limit),
            }
        });
    } catch (error) {
        console.log(`Error By user Controller Js For getSF`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const updateSF = async (req, res) => {
    try {
        let { id } = req.params;
        let { role, SID, enrollmentNumber, courseId, semester, division, HODId, subjects, email, ...commonFields } = req.body
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ success: false, Message: "User Not Found...!" })
        }
        if (req.user && (req.user.role == "Admin" || req.user.role == "Student")) {
            if (role == 'Student') {
                if (!enrollmentNumber || !courseId || !semester || !division || !SID) {
                    return res.status(400).json({ success: false, error: "Student must have enrollmentNumber, courseId, division, SID and semester" });
                } else if (role === "Faculty") {
                    if (!HODId || !subjects || subjects.length === 0) {
                        return res.status(400).json({ success: false, error: "Faculty must have HODId and at least one subject" });
                    }
                }
            }
            const newUser = new User({
                ...commonFields,
                role,
                SID: role === "Student" ? SID : null,
                enrollmentNumber: role === "Student" ? enrollmentNumber : null,
                courseId,
                semester,
                HODId: role === "Faculty" ? HODId : null,
                subjects: role === "Faculty" ? subjects : [],
            });
            await newUser.save();
            res.status(201).json({ success: true, message: `${role} Update successfully`, user: newUser });
        } else {
            res.status(401).json({ success: false, message: "Unauthorized Page" });
        }
    } catch (error) {
        console.log(`Error By user Controller Js For updateFS`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const deleteSf = async (req, res) => {
    try {
        const { ids } = req.body;
        const user = await User.find({ _id: { $in: ids } });
        if (user.length === 0) {
            return res.status(404).json({ success: false, Message: "User Not Found...!" })
        }

        if (req.user && req.user.role == "Admin") { 
            let deleteUser = await User.deleteMany({ _id: { $in: ids } })
            return res.json({ message: "Deleted successfully", data:deleteUser });
        } else { 
            res.status(401).json({ success: false, message: "Unauthorized Page" }); 
        }
    } catch (error) {
        console.log(`Error By user Controller Js For updateFS`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

