import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    listingLimit: {
        type: Number,
        required: true
    },
    featuredLimit: {
        type: Number,
        default: 0
    },
    durationDays: {
        type: Number,
        required: true,
        default: 30
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
