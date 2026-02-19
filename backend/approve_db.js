import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/propertymodel.js';

dotenv.config();

async function approve() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/merobhumi');

        console.log("Approving 'Final Success Villa'...");
        const result = await Property.updateOne(
            { title: "Final Success Villa" },
            { $set: { status: "approved" } }
        );

        if (result.matchedCount > 0) {
            console.log("SUCCESS: Property approved.");
        } else {
            console.log("ERROR: Property not found.");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

approve();
