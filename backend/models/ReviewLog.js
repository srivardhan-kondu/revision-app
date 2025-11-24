import mongoose from 'mongoose';

const reviewLogSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
        date: { type: Date, required: true },
        response: { type: String, enum: ['remembered', 'okay', 'forgot'], required: true },
        stageBefore: { type: Number, required: true },
        stageAfter: { type: Number, required: true }
    },
    { timestamps: true }
);

export const ReviewLog = mongoose.model('ReviewLog', reviewLogSchema);
