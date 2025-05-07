import { User } from "../model/userSchema.js";
import { generateTokenAndCookieSet } from "../util/generateTokenAndCookieSet.js";

export const login = async(req,res)=>{
    try {
        let {SID,email,password} =req.body
        let user;
       console.log(req.body);
       
       if(req.body.email){
       user = await User.findOne({email:email})
        }else if(req.body.SID){
            user = await User.findOne({$or: [{ SID:SID }]})
        }
        if(!user){
            res.status(400).json({success:false,message:`User Not Found. please Chekc.`})
        }
        const mtchPassword = await user.comparePassword(password)
        console.log(mtchPassword);
        
        if(mtchPassword){
           let token = await generateTokenAndCookieSet(user._id,res)
            res.status(201).cookie('jwt-RVCAPUS', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({success:true,token:token,user:{
                ...user._doc,
                password:"",
               
            }})
        }else{
            res.status(404).json({success:false,message:'Password Not Match.'})
        }
    } catch (error) {
        console.log(`Error By auth Controller Js For login`,error);
        res.status(500).json({msg:'Internal  Error.', Error:error}) 
    }
}

export const logOut = async(req,res)=>{
    try {
        req.user = null;
        res.clearCookie('jwt-RVCAPUS');
        return res.status(200).json({
            message: "Logged out Successfully.",
            success: true
        });
    } catch (error) {
        console.log(`Error By auth Controller Js For logOut`,error);
        res.status(500).json({msg:'Internal  Error.', Error:error}) 
    }
}