import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from '../models/planmodel.js';

dotenv.config();

const plans = [
    {
        name: "Standard Free",
        price: 0,
        listingLimit: 1,
        featuredLimit: 0,
        durationDays: 30,
        description: "Standard free listing for property owners."
    },
    {
        name: "Pro Partner",
        price: 999,
        listingLimit: 10,
        featuredLimit: 2,
        durationDays: 30,
        description: "Professional plan for real estate agents and developers."
    },
    {
        name: "Enterprise",
        price: 2499,
        listingLimit: 50,
        featuredLimit: 10,
        durationDays: 90,
        description: "Premium exposure for large property portfolios."
    }
];

const seedPlans = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/merobhumi');
        console.log('Connected to MongoDB');

        await Plan.deleteMany({});
        console.log('Cleared existing plans');

        await Plan.insertMany(plans);
        console.log('Default plans seeded successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding plans:', error);
        process.exit(1);
    }
};

seedPlans();
