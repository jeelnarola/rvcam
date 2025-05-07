import { User } from "../model/userSchema.js";
import { sendMail } from "../util/emailMessageSend.js";

export const addSF = async (req, res) => {
    try {
        let { role, SID, enrollmentNumber, courseId, semester, division, HODId, subjects, name, email, mobileNumber,password, ...commonFields } = req.body;

        // Check if the user already exists by name
        const user = await User.findOne({
            $or: [
                { name: name },
                { email: email },
                { mobileNumber: mobileNumber }
            ]
        });
        
        if (user) {
            
            let message = "User Already Exists!";
            if (user.name === name) message = "Name is already taken!";
            else if (user.email === email) message = "Email is already registered!";
            else if (user.mobileNumber === mobileNumber) message = "Mobile number is already in use!";
            return res.status(400).json({ success: false, message });
        }
        if (req.user && req.user.role == "Admin") {

            if (role === 'Student') {
                if (!enrollmentNumber || !courseId || !semester || !division || !SID) {
                    return res.status(400).json({ success: false, error: "Student must have enrollmentNumber, courseId, division, SID, and semester" });
                }
            }
            else if (role === "Faculty") {
                if (!HODId || !subjects || subjects.length === 0) {
                    return res.status(400).json({ success: false, error: "Faculty must have HODId and at least one subject" });
                }
                // Do NOT include enrollmentNumber for Faculty (set it to undefined)
                enrollmentNumber = undefined;
            } else {
                enrollmentNumber = null,
                    SID = null
            }
            // Prepare user data based on role
            const userData = {
                ...commonFields,
                name,
                role,
                email,
                mobileNumber,
                ...(role === "Student" && { SID, enrollmentNumber }), // Only include SID and enrollmentNumber for Students
                courseId,
                semester,
                ...(role === "Faculty" && { HODId, subjects }) // Faculty-specific fields
            };

            const newUser = new User(userData);

            try {
                // Save the new user to the database
                const d = await newUser.save();
                console.log("d", d);

                // Send email after successful user creation
                sendMail(name,req.body.email,password);

                return res.status(201).json({ success: true, message: "User created successfully", user: newUser });
            } catch (error) {
                // Check if the error is related to duplicate keys (like enrollmentNumber)
                if (error.code === 11000) {
                    return res.status(400).json({ success: false, error: "Duplicate entry detected for unique fields", error });
                }
                return res.status(500).json({ success: false, error: error.message });
            }
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


// export const addSF = async (req, res) => {
//     try {
//         let { role, SID, enrollmentNumber, courseId, semester, division, HODId, subjects, name, email, ...commonFields } = req.body
//         console.log(req.body);

//         const user = await User.findOne({ name: name })
//         if (user) {
//             return res.status(400).json({ success: false, Message: "User Alrday Extis...!" })
//         }
//         if (req.user && req.user.role == "Admin") {
//             if (role == 'Student') {
//                 if (!enrollmentNumber || !courseId || !semester || !division || !SID) {
//                     return res.status(400).json({ success: false, error: "Student must have enrollmentNumber, courseId, division, SID and semester" });
//                 }
//             } else if (role === "Faculty") {
//                 if (!HODId || !subjects || subjects.length === 0) {
//                     return res.status(400).json({ success: false, error: "Faculty must have HODId and at least one subject" });
//                 }
//                 // Ensure enrollmentNumber is not included for Faculty
//                 // enrollmentNumber = undefined; 
//             }

//             const userData = {
//                 ...commonFields,
//                 name,
//                 role,
//                 email,
//                 // ...(role === "Student" && { SID, enrollmentNumber }), // Only include SID and enrollmentNumber for Students
//                 courseId,
//                 semester,
//                 ...(role === "Faculty" && { HODId, subjects }) // Faculty-specific fields
//             };
//             const newUser1 = new User(userData);
//             try {

//                 const d = await newUser1.save();
//                 sendMail(req.body.email);
//                 return res.status(201).json({ success: true, message: "User created successfully", user: newUser1 });
//             } catch (error) {
//                 if (error.code === 11000) {
//                     return res.status(400).json({ success: false, error: "Duplicate entry detected for unique fields",error });
//                 }
//                 return res.status(500).json({ success: false, error: error.message });
//             }
//         }
//     else {
//         return res.status(401).json({ success: false, message: "Unauthorized Page" });
//      }
//         // if (req.user && req.user.role == "Admin") {
//         //     if (role == 'Student') {
//         //         if (!enrollmentNumber || !courseId || !semester || !division || !SID) {
//         //             return res.status(400).json({ success: false, error: "Student must have enrollmentNumber, courseId, division, SID and semester" });
//         //         } 
//         //     }else if (role === "Faculty") {
//         //         if (!HODId || !subjects || subjects.length === 0) {
//         //             return res.status(400).json({ success: false, error: "Faculty must have HODId and at least one subject" });
//         //         }
//         //     }
//         //     const newUser = new User({
//         //         ...commonFields,
//         //         name,
//         //         role,
//         //         email,
//         //         ...(role === "Student" && { SID, enrollmentNumber }),
//         //         // enrollmentNumber: role === "Student" ? enrollmentNumber : null,
//         //         courseId,
//         //         semester,
//         //         ...(role === "Faculty" && { HODId, subjects }),
//         //     });
//         //     // db.users.createIndex({ SID: 1 }, { unique: true, sparse: true });

//         //     const d = await newUser.save();
//         //     // console.log(d);
//         //     sendMail(req.body.email)
//         //     return res.status(201).json({ success: true, message: "User created successfully", user: newUser });

//     } catch (error) {
//         console.log(`Error By user Controller Js For addFS`, error);
//         res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
//     }
// }

export const getSF = async (req, res) => {
    try {
        let { page, limit, role, name, SID, courseId, semester, division } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        let skip = (page - 1) * limit;
        let searchFilter = {};
        let filterConditions = [];

        if (role) filterConditions.push({role: { $in: role.map(r => new RegExp(r, 'i')) }});
        if (name) filterConditions.push({ name: { $regex: name, $options: "i" } });
        if (SID) filterConditions.push({ SID: { $regex: SID, $options: "i" } });
        if (courseId) filterConditions.push({ courseId: { $regex: courseId, $options: "i" } });
        if (semester) filterConditions.push({ semester: { $regex: semester, $options: "i" } });
        if (division) filterConditions.push({ division: { $regex: division, $options: "i" } });

        // Apply search filter only if filters exist
        if (filterConditions.length > 0) {
            searchFilter.$or = filterConditions;
        }
        const findUser = await User.find(searchFilter)
        .skip(skip)
        .limit(limit)
        .populate([
            { path: "courseId"},
            { path: "subjects" }
          ]);
      
        const totalFind = await User.countDocuments(searchFilter);
        res.status(200).json({
            success: true,
            data:findUser,
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
                id, req.body,
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
            return res.status(401).json({ success: false, message: "Unauthorized Page" });
        }
    } catch (error) {
        console.log(`Error By user Controller Js For updateFS`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

