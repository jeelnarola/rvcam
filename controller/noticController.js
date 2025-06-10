import { Notice } from "../model/noticeSchema.js";

export const sendNotice = async(req,res)=>{
    try {
        let {title,...commonFields} = req.body

        console.log(title,commonFields);

        const findNotice = await Notice.find({title})

        if(findNotice.length !== 0 && findNotice.length >= 0){
             return res.status(400).json({ success: false, message:"Notice Already Exists!" });
        }else{
            const noticeData = await Notice.create(req.body)
            return res.status(201).json({ success: true, message: "Notice created successfully", data: noticeData });
        }
        
    } catch (error) {
        console.log(`Error By Notice Controller Js For sendNotice`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const getNotice = async(req,res)=>{
    try {
         const { audience } = req.body;
          if (!audience) {
      return res.status(400).json({ error: "Audience is required" });
    }
        if (req.user && req.user.role == "Admin"){
            const noticeAll = await Notice.find();
            return res.status(201).json({ success: true, message: "Notice Get successfully", data: noticeAll });
        }else{
            const noticeCompleted = await Notice.find({
                isStatus:"Completed",
                  audience: { $in: [audience, "All"] }
            });
            return res.status(201).json({ success: true, message: "Notice All successfully", data: noticeCompleted });

        }
    } catch (error) {
        console.log(`Error By Notice Controller Js For getNotice`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}