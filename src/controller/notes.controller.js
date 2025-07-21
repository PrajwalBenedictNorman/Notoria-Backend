import { Notes } from "../model/Notes.model.js";
import uploadFile from "../utils/cloudinary.js"


export const addNotes=async (req,res)=>{
    try {
        const {title,content,tags,isPinned}=req.body
    
        if(!title && !content) return res.status(400).json({message:"Entries are required"})
        const userID=req.user?._id  
        if(!userID) return res.status(400).json({message:"user not found"})
        console.log(userID);

        const picture=req.files?.picture[0]?.path
       const documents=req.files?.documents[0]?.path // this will store the path of diff document one by one

        const pic= await uploadFile(picture)
        if(!pic) return res.status(500).json({message:"No picture are uploded"})

        //   const docs = await Promise.all(documents.map(async (doc) => {
        //     const uploaded = await uploadFile(doc);
        //     return uploaded?.secure_url;
        // }));

      const docs=await uploadFile(documents)
        if(!docs) return res.status(500).json({message:"No docs are uploded"})
        

        const notes= await Notes.create({
                title,
                content,
                isPinned,
                tags,
                picture:pic.secure_url,
                documents:docs.secure_url,
                userID
            })
    
        if(!notes) return res.status(400).json({message:"notes not created"})        
            return res.status(200).json({message:"notes added",data:{noteID:notes}})
    } catch (error) {
      
        return res.status(400).json({
            message:"note not added"
        })
    }
}



export const deleteNote =async (req,res)=>{
    try {
        const noteID=req.params.noteID
        const userID=req.user?._id
        // console.log(noteID);  debugging
        
        if(!noteID) return res.status(400).json({
            message:"note ID not found"
        })
        if(!userID) return res.status(400).json({message:"user ID not found"})

            //Method 1 but it loads the database by asking two queries

        //  const note=await Notes.findOne({userID,_id:noteID}) // using findOne as it will check both userID and noteId and if use findById it will only check one noteId
        // if(!note) return res.status(400).json({
        //     message:"user and note not found"
        // })
        // console.log(note);
        // const result= await Notes.findByIdAndDelete({_id:noteID})  

        //method 2 it triggers the database only once and deletes the data linked with _id

        const result = await Notes.findOneAndDelete({_id:noteID,userID})
        console.log(result);
        if(!result) return res.status(400).json({
            message:"result didn't came"
        })
        return res.status(200).json({
            message:"note deleated successfully"
        })
    } catch (error) {
      return res.status(500).json({
        message:"note not deleated"
      })  
    }
    
}


export const updataeNote=async (req,res)=>{
  try {
    const userID=  req.user?._id
    const noteId=req.params.noteID
    const {title,content,isPinned,tags}=req.body
  

    const picture=req.files?.picture[0]?.path
    const document=req.files?.documents[0]?.path

    const pic= await uploadFile(picture)
    const doc= await uploadFile(document)

    if(!pic) return res.status(500).json({message:"picture not uploaded in cloudinary"})
    if(!doc) return res.status(500).json({message:"document not uploaded in cloudinary"})

    const updateParameter={}
    if (title) updateParameter.title=title
    if(content) updateParameter.content=content
    if(isPinned) updateParameter.isPinned=isPinned
    if(tags) updateParameter.tags=tags
    if(pic) updateParameter.picture=pic.secure_url
    if(doc)updateParameter.documents=doc.secure_url

    const noted=await Notes.findOneAndUpdate({_id:noteId,userID},{$set:updateParameter},{new:true})

    if(!noted) return res.status(400).json({message:"Note not updated successfully"})
  
      return res.status(200).json({
          message:"note update successfully",
          data:{noted}
      })
  
  } catch (error) {
    throw error
  }
}

export const getAllNotes=async(req,res)=>{
  try {
      const userID=req.user?._id
      let notes=[]
      notes=await Notes.find({userID})

    if(!notes) return res.status(400).json({message:"not notes were found"})
      
     return res.status(200).json({
     message:"notes are found",
      data:notes})

  } catch (error) {
    throw error
  }
    
}