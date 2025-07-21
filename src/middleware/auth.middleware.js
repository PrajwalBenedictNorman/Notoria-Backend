import { User } from "../model/User.model.js";
import jwt from "jsonwebtoken"


export const verifyjwt=async (req,res,next)=>{
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();    
     if(!token) return res.status(401).json({message:"No access token received"})
      console.log(token);
      


     const decrypt=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     const user = await User.findById(decrypt?._id).select("-password -refreshToken")
     if(!user) return res.status(400).json({message:"user not found using access token"})
     
     req.user=user
     next()
 
   } catch (error) {
    console.log("Error occured in jwt verification",error);
    return res.status(403).json({ message: "Invalid or expired token" });
   }
}