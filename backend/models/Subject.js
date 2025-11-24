import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true }
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const Subject = mongoose.model('Subject', subjectSchema);
