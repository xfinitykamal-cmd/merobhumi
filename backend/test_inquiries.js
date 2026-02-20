import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Inquiry from './models/Inquiry.js';
import Property from './models/propertymodel.js';
import User from './models/Usermodel.js';

dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const inquiries = await Inquiry.find()
            .populate('property', 'title price location')
            .populate('buyer', 'name email')
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });

        console.log(`Successfully fetched ${inquiries.length} inquiries with populate.`);
        process.exit(0);
    } catch (error) {
        console.error("DB Query Error:", error);
        process.exit(1);
    }
}
test();
