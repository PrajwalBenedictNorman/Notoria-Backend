import mongoose, { Schema } from "mongoose";

const notesSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    content:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        default:[]
    },
    isPinned:{
        type:Boolean,
        default:false
    },
    userID:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    picture:{
        type:String,
        default:""
    },
    documents:{
        type:String,
        default:""
    }

},{timestamps:true})

export const Notes=mongoose.model("Notes",notesSchema)