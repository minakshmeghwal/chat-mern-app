import mongoose from 'mongoose'
import dotenv from 'dotenv'
//connect mongodb with our application
dotenv.config();

//for connect mongodb atlas their is special symbols instead of that we use that
const connectDB=async ()=>{
    try {
        const conn=await mongoose.connect("mongodb+srv://meenakshiparihar789:Sanju%402112@cluster0.dgmcidm.mongodb.net/",{
            useNewUrlParser:true,
            useUnifiedTopology:true,
           
            
        })

        console.log("mongodb connected",conn.connection.host)
    } catch (error) {
        console.log("error in connecting mongodb",error.message)
        process.exit
        
    }
}

export default connectDB;