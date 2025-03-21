import jwt from 'jsonwebtoken'
import 'dotenv/config'
export const generateTokenAndCookieSet = async(userid,res)=>{
    try {
        let token = jwt.sign({userid},process.env.JWTKEY,{expiresIn:'1d'})
        res.status(201).cookie("jwt-RVCAPUS",token,{
            maxAge:1 * 24 * 60 * 60 * 1000, // 1 days in MS
            httpOnly:true,
            sameSite:"strict"
        })
        return token;
    } catch (error) {
        console.log(`Error By util For generateTokenAndCookieSet`,error);
        res.status(500).json({msg:'Internal  Error.', Error:error})
    }
}