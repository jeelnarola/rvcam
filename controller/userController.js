import { User } from "../model/userSchema";

export const addSF = async(req,res)=>{
    try {
        let {role,SID,enrollmentNumber,courseId,semester,division,HODId,subjects,...commonFields} = req.body
        const user = await User.findOne({$or: [{ email }, { SID }]})

        if(!user){
            return res.status(404).json({success:false,Message:"User Not Found...!"})
        }

        if(role == 'Student'){
            if (!enrollmentNumber || !courseId || !semester || !division || !SID) {
                return res.status(400).json({success:false, error: "Student must have enrollmentNumber, courseId, division, SID and semester" });
            }else if (role === "Faculty") {
                if (!HODId || !subjects || subjects.length === 0) {
                    return res.status(400).json({success:false, error: "Faculty must have HODId and at least one subject" });
                }
            }
        }
        const newUser = new User({
            ...commonFields,
            role,
            SID : role === "Student" ? SID : null,
            enrollmentNumber: role === "Student" ? enrollmentNumber : null,
            courseId,
            semester,
            HODId: role === "Faculty" ? HODId : null,
            subjects: role === "Faculty" ? subjects : [],
        });
        await newUser.save();
        res.status(201).json({success:true, message: "User created successfully", user: newUser });
    } catch (error) {
        console.log(`Error By user Controller Js For addFS`);
        res.status(500).json({success:false,msg:'Internal  Error.', Error:error})  
    }
}