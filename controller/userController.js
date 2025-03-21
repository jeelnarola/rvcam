import { User } from "../model/userSchema.js";
import { sendMail } from "../util/emailMessageSend.js";

export const addSF = async (req, res) => {
    try {
        let { role, SID, enrollmentNumber, courseId, semester, division, HODId, subjects, name, email, ...commonFields } = req.body
        const user = await User.findOne({ name: name })
        if (user) {
            return res.status(404).json({ success: false, Message: "User Alrday Extis...!" })
        }
        console.log(req.user);
        
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
                name,
                role,
                email,
                SID: role === "Student" ? SID : undefined,
                enrollmentNumber: role === "Student" ? enrollmentNumber : null,
                courseId,
                semester,
                HODId: role === "Faculty" ? HODId : null,
                subjects: role === "Faculty" ? subjects : [],
            });
            await newUser.save();
            sendMail(req.body.email)
            return res.status(201).json({ success: true, message: "User created successfully", user: newUser });
        } else {
           return res.status(401).json({ success: false, message: "Unauthorized Page" });
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
        let searchFilter = {};
        let filterConditions = [];

        if (role) filterConditions.push({ role: { $regex: role, $options: "i" } });
        if (name) filterConditions.push({ name: { $regex: name, $options: "i" } });
        if (SID) filterConditions.push({ SID: { $regex: SID, $options: "i" } });
        if (courseId) filterConditions.push({ courseId: { $regex: courseId, $options: "i" } });
        if (semester) filterConditions.push({ semester: { $regex: semester, $options: "i" } });
        if (division) filterConditions.push({ division: { $regex: division, $options: "i" } });

        // Apply search filter only if filters exist
        if (filterConditions.length > 0) {
            searchFilter.$or = filterConditions;
        }
        const findUser = await User.find(searchFilter).skip(skip).limit(limit);
        const totalFind = await User.countDocuments(searchFilter);
        res.status(200).json({
            success: true,
            findUser,
            pagination: {
                currentPage: page,
                totalFind,
                totalPages: Math.ceil(totalFind / limit),
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
        if (req.user && (req.user.role == "Admin" || req.user.name == user.name)) {
            if (role == 'Student') {
                if (!enrollmentNumber || !courseId || !semester || !division || !SID) {
                    return res.status(400).json({ success: false, error: "Student must have enrollmentNumber, courseId, division, SID and semester" });
                } else if (role === "Faculty") {
                    if (!HODId || !subjects || subjects.length === 0) {
                        return res.status(400).json({ success: false, error: "Faculty must have HODId and at least one subject" });
                    }
                }
            }
            const updatedUser = await User.findByIdAndUpdate(
                id,req.body,
                { new: true, runValidators: true }
            );
            res.status(201).json({ success: true, message: `${role} Update successfully`, user: updatedUser });
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
            return res.json({ message: "Deleted successfully", data: deleteUser });
        } else {
            res.status(401).json({ success: false, message: "Unauthorized Page" });
        }
    } catch (error) {
        console.log(`Error By user Controller Js For updateFS`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

