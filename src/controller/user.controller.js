import {User} from "../model/User.model.js"
import uploadFile from "../utils/cloudinary.js"
import mongoose from "mongoose"

const  generateAccessRefreshToken=async (userId)=>{
try {
    const user = await User.findById(userId)
    const accessToken=user.generateAccessToken()            
    const refreshToken=user.generateRefreshToken()

    user.refreshToken=refreshToken
    await user.save({validateBeforeSave: false}) // this is used to bypass mongodb validation bcos we are only adding refresh token and not other fields defined in the schema
    return {accessToken,refreshToken}
} catch (error) {
    console.error("Error generating tokens:", error);
}
}


export const registerUser= async (req,res)=>{


    try {
        const {username,password,email,fullName}=req.body
    
        if(!username || !password || !email || !fullName){
           return res.status(401).json({
                message:"All fields are required"
            })
        }
    
        const existedUser = await User.findOne({
            $or :[{email},{username}]
        })
    
        if(existedUser){
           return res.status(400).json({
                message:"User already exists"
            })
        }
    
        const profilePhotoPath = req.files?.profilePhoto[0]?.path; // multer store file in req.files not req.file
        
    
        if (!profilePhotoPath) 
            return res.status(400).json({
                message: "Profile photo is required",
            });
        
        
        const profileP=await uploadFile(profilePhotoPath)

        if(!profileP) return res.status(500).json({
                message:"profile photo not uploaded successfully"
            })
        
        console.log(profileP);
        
        const userCreated= await  User.create({
            username,
            password,
            email,
            profilePhoto:profileP.secure_url, // to get the string of the file uploaded
            fullName
        })
    
        if(!userCreated) return res.status(500).json({
                message:"User not registered"
            })
        
    
        return res.status(200).json({
            message:"User registered successfully"
        })
    } catch (error) {
        throw error
    }
}


export const login=async (req,res)=>{
    const {username,password,email}=req.body

    if(!username || !password || !email){
        return res.status(404).json({
            message:"All fields are required"
        })
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })
    // .select("+password") // +password to forcefully give password if it by chance fails to give wont by using this  
    if(!user){
        return res.status(400).json({
            message:"User does not exists"
        })
    }
    console.log("Stored Password in DB:", user.password); // checking if mongodb returned the password or not


    const isPasswordValid= await user.isPasswordCorrect(password);

   
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Credentials didn't match"
        })
    }

    const {accessToken,refreshToken}=await generateAccessRefreshToken(user._id)
    
    const logedInUser=await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly :true,
        secure:false,
        maxAge: 7*24*60*60*1000
    }

    return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json({
                success:true,
                statusCode:200,
                data:{
                    user:logedInUser,
                    accessToken: accessToken || "Token missing",
                    refreshToken: refreshToken || "Token missing"
                },
                message:"User LoggedIn successfully"
        })

}

export const logout = (async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({message:"logged out"})
})

export const updatePassword =async (req,res)=>{
try {
    const {oldPassword,newPassword}=req.body;
    const userID=req.user
    
    if(!oldPassword && !newPassword) return res.status(400).json({
        message:"Please enter the passwords"
    })
    
    if(oldPassword === newPassword) return res.status(400).json({message:"both the password sent are same"})
    
    const user=await User.findById(userID)
    
    if(!user) return res.status(400).json({message:"user not found"})
    
    user.password=newPassword
    
    const updatedPass=await user.save({validateBeforeSave:false})
    if(!updatedPass) return res.status(400).json({message:"user password not updated"})
    
        return res.status(200).json({message:"User password updated"})
} catch (error) {
    throw error
}   
}

export const updateProfile=async (req,res)=>{
   try {
     const userID= req.user?._id
     const {email,fullName} =req.body
     if(!email && !fullName) return res.status(400).json({message:"entries are compulsory"})
 
     
     
     const profilePhoto=req.files?.profilePhoto[0]?.path
        console.log(profilePhoto);
        let clouPic={};

     if(profilePhoto) {
 
         clouPic= await uploadFile(profilePhoto)
         if(!clouPic) return res.status(500).json({message:"cloudinary error"})
 
      } 
     // user.email=email can do this method but time taking and load on databse
 
     const user= await User.findByIdAndUpdate(userID,{
             $set:{
                 email,
                 fullName,
                 profilePhoto:clouPic.secure_url
             }
     },{new:true})
 
 
     if(!user) return res.status(400).json({message:"user not found"})
 
     return res.status(200).json({
             message:"User details updated successfully",
             data:user
         })
   } catch (error) {
    throw error
   }    
}


