import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/Usermodel.js';

dotenv.config();

async function checkAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/merobhumi');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@merobhumi.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        console.log(`Checking for admin: ${adminEmail}`);
        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log("Admin found in DB.");
            if (admin.role !== 'admin') {
                console.log("Updating role to admin...");
                admin.role = 'admin';
                await admin.save();
                console.log("Role updated.");
            }
        } else {
            console.log("Admin NOT found. Creating admin user...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            admin = new User({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log("Admin created successfully.");
        }

        console.log("Admin ID:", admin._id);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAdmin();
