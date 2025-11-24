import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const User = mongoose.model('User', userSchema);
