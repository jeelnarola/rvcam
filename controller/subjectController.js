import { Subject } from "../model/subjectSchema.js";

export const addSubject = async (req,res)=>{
    try {
        let {name,codeNumber,credits,facultyId,courseId,semester} =req.body;
        const subjectFind = await Subject.findOne({name:name}) 
        if(subjectFind){
            return res.status(200).json({ success: false, Message: "Subject Alrday Extis...!" })
        }
        if (req.user && req.user.role == "Admin"){
            const newSubject = new Subject({
                name,codeNumber,credits,facultyId,courseId,semester
            })            
            await newSubject.save();
            return res.status(201).json({ success: true, message: "Subject created successfully", data: newSubject });
        }else{
            return res.status(401).json({ success: false, message: "Unauthorized Page" });
        }
    } catch (error) {
        console.log(`Error By Subject Controller Js For addSubject`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const getSubject = async(req,res)=>{
    try {
        let {name,codeNumber,credits,facultyId,courseId,page,limit} =req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        let skip = (page - 1) * limit;
        let searchFilter = {};
        let filterConditions = [];

        if (name) filterConditions.push({ name: { $regex: name, $options: "i" } });
        if (codeNumber) filterConditions.push({ codeNumber: { $regex: codeNumber, $options: "i" } });
        if (credits) filterConditions.push({ courseId: { $regex: credits, $options: "i" } });

        // Apply search filter only if filters exist
        if (filterConditions.length > 0) {
            searchFilter.$or = filterConditions;
        }
         const findSubject = await Subject.find(searchFilter).skip(skip).limit(limit);
                const totalFind = await Subject.countDocuments(searchFilter);
        // searchFilter = {
        //     $or: [
        //         { name: { $regex: name, $options: "i" } }, // Case-insensitive name search
        //         { codeNumber: { $regex: codeNumber, $options: "i" } },
        //         { credits: { $regex: credits, $options: "i" } },
        //         { courseId: { $regex: courseId, $options: "i" } },
        //         { facultyId: { $regex: facultyId, $options: "i" } },
        //     ]
        // };
        // const findSubject = await Subject.find(searchFilter).skip(skip).limit(limit);
        // const totalFind = await Subject.countDocuments(searchFilter);
        res.status(200).json({
            success: true,
            findSubject,
            pagination: {
                currentPage: page,
                totalFind,
                totalPages: Math.ceil(totalFind / limit),
            }
        });

    } catch (error) {
        console.log(`Error By Subject Controller Js For getSubject`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const updateSubject = async(req,res)=>{
    try {
        const {id}=req.params;
        let {name,codeNumber,credits,facultyId,courseId} =req.body;
        const findSubject = await Subject.findById(id)

        if(!findSubject){
            return res.status(404).json({ success: false, Message: "Subject Not Found...!" })
        }
        if (req.user && req.user.role == "Admin"){
            const newSubject = new Subject({
                name,codeNumber,credits,facultyId,courseId
            })
            await newSubject.save();
            return res.status(201).json({ success: true, message: "Subject Update successfully", data: newSubject });
        }else{
            return res.status(401).json({ success: false, message: "Unauthorized Page" });
        }

    } catch (error) {
        console.log(`Error By Subject Controller Js For updateSubject`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}

export const deleteSubject = async(req,res)=>{
    try {
        let {ids}=req.body;
        const subject = await Subject.find({ _id: { $in: ids } });
                if (subject.length === 0) {
                    return res.status(404).json({ success: false, Message: "User Not Found...!" })
                }
                if (req.user && req.user.role == "Admin") { 
                    let deleteSubject = await Subject.deleteMany({ _id: { $in: ids } })
                    return res.json({ message: "Deleted successfully", data:deleteSubject });
                } else { 
                    res.status(401).json({ success: false, message: "Unauthorized Page" }); 
                }
    } catch (error) {
        console.log(`Error By Subject Controller Js For deleteSubject`, error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}