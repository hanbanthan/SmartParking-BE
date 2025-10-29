import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const connectDB = async () => {
    mongoose.connection.on(`connected`, () => {
        console.log('connected to mongodb');
    });
    await mongoose.connect(`${process.env.MONGODB_URI}`);
}

export default connectDB;