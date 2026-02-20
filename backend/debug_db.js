import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/Usermodel.js';
import Property from './models/propertymodel.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const admin = await User.findOne({ email: 'admin@merobhumi.com' });
        console.log("Admin User Role Check:", admin ? admin.email + " (Role: " + admin.role + ")" : "NOT FOUND");

        const pendingProperties = await Property.find({ status: 'pending' });
        console.log(`Found ${pendingProperties.length} pending properties.`);

        if (pendingProperties.length > 0) {
            console.log("Sample pending property owner ID:", pendingProperties[0].owner);
        }
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await mongoose.disconnect();
    }
}

check();
