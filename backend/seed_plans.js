import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from './models/planmodel.js';

dotenv.config();

const plans = [
    {
        name: 'Basic (Free)',
        price: 0,
        listingLimit: 2,
        featuredLimit: 0,
        durationDays: 30,
        description: 'Perfect for individuals looking to sell or rent a single property.'
    },
    {
        name: 'Standard',
        price: 599,
        listingLimit: 10,
        featuredLimit: 2,
        durationDays: 30,
        description: 'Ideal for small agencies and active sellers.'
    },
    {
        name: 'Premium',
        price: 1499,
        listingLimit: 50,
        featuredLimit: 10,
        durationDays: 60,
        description: 'Best for large agencies and commercial developers.'
    }
];

const seedPlans = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if plans already exist
        const count = await Plan.countDocuments();
        if (count > 0) {
            console.log('⚠️ Plans already exist. Deleting existing plans...');
            await Plan.deleteMany({});
        }

        await Plan.insertMany(plans);
        console.log('✅ Plans seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding plans:', error.message);
        process.exit(1);
    }
};

seedPlans();
