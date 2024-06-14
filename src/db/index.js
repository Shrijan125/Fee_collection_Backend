import mongoose from "mongoose";

const connectDB=async ()=>{
    try {
        const dburl=process.env.DATABASE_URL;
        console.log(dburl);
        const connectionInstance = await mongoose.connect(dburl);
        console.log('Mongo DB connection successful: Host:'+connectionInstance.connection.host);
    } catch (error) {
        console.log('Connection to mongoDb failed');
        process.exit(1);
    }
};

export default connectDB;