import {upload} from "../middleware/multer.middleware.js"
import { Router } from "express"
import { registerUser,login, logout,updatePassword, updateProfile } from "../controller/user.controller.js"
import { verifyjwt } from "../middleware/auth.middleware.js"

const router = Router()

// router.post("/register", upload.single("profilePhoto"), registerUser); // one method
router.route("/register").post(
    upload.fields([
        {
            name:"profilePhoto",
            maxCount:1
        }
    ]),registerUser
)

router.route("/login").post(login)
router.route("/logout").post(verifyjwt,logout)
router.route("/updatePassword").post(verifyjwt,updatePassword)
router.route("/updateProfile").post( verifyjwt,
    upload.fields([
        {
            name:"profilePhoto",
            maxCount:1
        }
    ]),
   updateProfile)

export default router;