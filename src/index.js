import dotenv from "dotenv"
import connectDB from "./db/connectDB.js";
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"


const app = express()
dotenv.config({
    path:"./.env"
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cors({
 origin:"http://localhost:5173",
 credentials:true,
 methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
 allowedHeaders: ["Content-Type", "Authorization"] // Allowed headers
}
   
))
connectDB();

import userRoute from "./routes/user.routes.js"
import noteRoute from "./routes/notes.router.js"
app.use("/api/v1/users", userRoute);

app.use("/api/v1/user",noteRoute);
console.log("User routes loaded");


app.listen(process.env.PORT,()=>{
    console.log(`Server running at port ${process.env.PORT}`);
    
})