import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
        title: { type: String, required: true },
        description: { type: String },
        stage: { type: Number, default: 0 },
        nextReview: { type: Date, required: true }
    },
    { timestamps: true }
);

export const Item = mongoose.model('Item', itemSchema);
