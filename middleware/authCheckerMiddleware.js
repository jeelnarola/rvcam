import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { User } from '../model/userSchema.js';

export const authChecker = async(req,res,next)=>{
    try {
        let Authorization = req.headers.authorization;
        console.log("log",Authorization);
        
        if(!Authorization){
            return res.status(401).json({success:false,message:"User Not authenticated !!"})
        }
        Authorization = Authorization.replace("Bearer ", "") 
        const decode = await jwt.verify(Authorization,process.env.JWTKEY)
        if(!decode){
            return res.status(401).json({success:false,message:"Invalid"})
        }
        const user = await User.findById(decode.userid)
        if(!user){
            res.status(404).json({success:false,message:"User Not Found."})
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(`Error By Middleware Js For authCheck`,error);
        res.status(500).json({ success: false, msg: 'Internal  Error.', Error: error })
    }
}