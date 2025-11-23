import mongoose from "mongoose"


const connectDB= async()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected Successfully");
        
    } catch (error) {
        
    }
}

export default connectDB;