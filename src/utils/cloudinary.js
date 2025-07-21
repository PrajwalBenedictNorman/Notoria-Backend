import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    // secure:true // this comes true by default in new versions
})

const uploadFile=async (LocalFilePath)=>{

const options={
    resource_type:"auto",
    use_filename:true,
    unique_filename:true, //add some char in the file name
    overwrite:false  // Overwrites any image with the same public ID on upload.
}
    try {
        const result=await cloudinary.uploader.upload(LocalFilePath,options) // option can be written directly here also
        if(result){
            console.log("file uploaded sucessfully");
            fs.unlinkSync(LocalFilePath)
            return result
        }
    } catch (error) {
        console.log("Error while uploading in cloudinary");
        fs.unlinkSync(LocalFilePath) // sync unlinking bcos this task is to perform
    }
}

export default uploadFile;
