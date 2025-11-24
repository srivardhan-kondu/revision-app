import { Subject } from '../models/Subject.js';

export const getSubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.find({ userId: req.user._id }).sort({
            createdAt: 1
        });
        res.json(subjects);
    } catch (err) {
        next(err);
    }
};

export const createSubject = async (req, res, next) => {
    try {
        const { name } = req.body || {};
        if (!name) {
            return res.status(400).json({ message: 'Subject name is required.' });
        }
        const subject = await Subject.create({ userId: req.user._id, name });
        res.status(201).json(subject);
    } catch (err) {
        next(err);
    }
};
