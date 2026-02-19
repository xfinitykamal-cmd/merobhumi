import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/propertymodel.js';

dotenv.config();

async function check() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/merobhumi');

        console.log("Searching for 'Final Success Villa'...");
        const villa = await Property.findOne({ title: "Final Success Villa" });

        if (villa) {
            console.log("FOUND VILLA:");
            console.log(JSON.stringify(villa, null, 2));
        } else {
            console.log("VILLA NOT FOUND.");
            const count = await Property.countDocuments();
            console.log(`Total properties in DB: ${count}`);
            const latest = await Property.find().sort({ createdAt: -1 }).limit(5);
            console.log("Latest 5 properties:", JSON.stringify(latest.map(p => ({ title: p.title, status: p.status })), null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
