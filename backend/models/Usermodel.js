import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    activeSubscription: {
        plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
        startDate: { type: Date },
        expiryDate: { type: Date },
        usedListings: { type: Number, default: 0 }
    },
    resetToken: { type: String },
    resetTokenExpire: { type: Date }
});

const User = mongoose.model('User', UserSchema);

export default User;