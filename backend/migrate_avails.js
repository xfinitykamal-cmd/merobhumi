import mongoose from 'mongoose';
import Property from './models/propertymodel.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const result1 = await Property.updateMany({ availability: 'buy' }, { $set: { availability: 'sale' } });
        const result2 = await Property.updateMany({ availability: 'Buy' }, { $set: { availability: 'sale' } });
        console.log('Migrated properties:', result1.modifiedCount + result2.modifiedCount);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}).catch(console.error);
