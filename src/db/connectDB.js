import mongoose from "mongoose";

const connectDB= async ()=>{
try {
   const connectionInstance= await mongoose.connect(process.env.MONGODB_URL)
   console.log(`Database connected at ${connectionInstance.connection.host}`);
   
} catch (error) {
 console.log(error);
    
}
}

export default connectDB;