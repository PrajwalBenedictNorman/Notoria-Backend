import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { addNotes, deleteNote, getAllNotes, updataeNote } from "../controller/notes.controller.js";
import {upload} from "../middleware/multer.middleware.js"

const router=Router();

router.route("/add-note").post(verifyjwt,upload.fields([{
    name:"picture",
    maxCount:1,
    
},{
    name:"documents",
    maxCount:1
}
]),addNotes)
router.route("/deleat-note/:noteID").delete(verifyjwt,deleteNote)
router.route("/update-note/:noteID").put(verifyjwt,upload.fields([{
    name:"picture",
    maxCount:1,
    
},{
    name:"documents",
    maxCount:1
}
]),updataeNote)
router.route("/get-notes").get(verifyjwt,getAllNotes)

export default router