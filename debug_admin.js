import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './backend/models/Usermodel.js';
import Property from './backend/models/propertymodel.js';

dotenv.config({ path: './backend/.env' });

async function check() {
    await mongoose.connect(process.env.MONGODB_URI);

    const admin = await User.findOne({ email: 'admin@merobhumi.com' });
    console.log("Admin User:", admin ? admin.email + " (Role: " + admin.role + ")" : "NOT FOUND");

    const pendingProperties = await Property.find({ status: 'pending' });
    console.log(`Found ${pendingProperties.length} pending properties.`);

    if (pendingProperties.length > 0) {
        console.log("Sample pending property title:", pendingProperties[0].title);
    }

    const approvedProperties = await Property.find({ status: 'approved' });
    console.log(`Found ${approvedProperties.length} approved properties.`);

    mongoose.disconnect();
}

check();
