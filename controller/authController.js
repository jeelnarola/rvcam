import { User } from "../model/userSchema.js";

export const login = async(req,res)=>{
    try {
        let {SID,email,passwrod} =req.body
        const user = await User.find({$or: [{ email }, { SID }]})
        if(!user){
            return res.status(400).json({success:false,message:`User Not Found. please Chekc.`})
        }

        if(user.role=='Student'){
            if(!SID){
                return res.status(400).json({ error: "Student must have SID. " });
            }
            const mtchPassword = await User.comparePassword(passwrod)
            if(mtchPassword){
                let token = generateTokenAndCookieSet(user._id,res)
                res.status(201).cookie('jwt-RVCAPUS', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({success:true,user:{
                    ...user._doc,
                    password:""
                }})
            }else{
                res.status(404).json({success:false,message:'Password Not Match.'})
            }
        }
    } catch (error) {
        console.log(`Error By auth Controller Js For login`,error);
        res.status(500).json({msg:'Internal  Error.', Error:error}) 
    }
}

export const logOut = async(req,res)=>{
    try {
        return res.cookie('jwt-RVCAPUS', "", { maxAge: 0 }).json({
            message: "Logged out SuccessFully.",
            success: true
        })
    } catch (error) {
        console.log(`Error By auth Controller Js For logOut`,error);
        res.status(500).json({msg:'Internal  Error.', Error:error}) 
    }
}