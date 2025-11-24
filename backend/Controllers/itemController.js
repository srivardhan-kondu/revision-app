import { Subject } from '../models/Subject.js';
import { Item } from '../models/Item.js';
import { ReviewLog } from '../models/ReviewLog.js';
import { STAGE_GAPS, addDays, startOfDay, endOfDay } from '../utils/spacedConfig.js';

export const createItem = async (req, res, next) => {
    try {
        const { subjectId, title, description } = req.body || {};
        if (!subjectId || !title) {
            return res
                .status(400)
                .json({ message: 'Subject and title are required.' });
        }

        const subject = await Subject.findOne({
            _id: subjectId,
            userId: req.user._id
        });
        if (!subject) {
            return res.status(400).json({ message: 'Subject not found.' });
        }

        const stage = 0;
        const nextReview = addDays(new Date(), STAGE_GAPS[stage]);

        const item = await Item.create({
            userId: req.user._id,
            subjectId,
            title,
            description,
            stage,
            nextReview
        });

        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
};

export const getDueItems = async (req, res, next) => {
    try {
        const dateStr = req.query.date;
        const date = dateStr ? new Date(dateStr) : new Date();

        const start = startOfDay(date);
        const end = endOfDay(date);

        const items = await Item.find({
            userId: req.user._id,
            nextReview: { $gte: start, $lte: end }
        })
            .populate('subjectId', 'name')
            .sort({ nextReview: 1, createdAt: 1 });

        res.json(items);
    } catch (err) {
        next(err);
    }
};

export const reviewItem = async (req, res, next) => {
    try {
        const { response } = req.body || {};
        const { id } = req.params;

        if (!['remembered', 'okay', 'forgot'].includes(response)) {
            return res
                .status(400)
                .json({ message: 'Invalid response option.' });
        }

        const item = await Item.findOne({
            _id: id,
            userId: req.user._id
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found.' });
        }

        const stageBefore = item.stage;
        const maxIndex = STAGE_GAPS.length - 1;
        let newStage = stageBefore;

        if (response === 'remembered') {
            newStage = Math.min(stageBefore + 1, maxIndex);
        } else if (response === 'okay') {
            newStage = Math.max(stageBefore - 1, 0);
        } else if (response === 'forgot') {
            newStage = 0;
        }

        const today = new Date();
        const nextReview = addDays(today, STAGE_GAPS[newStage]);

        item.stage = newStage;
        item.nextReview = nextReview;
        await item.save();

        // log review
        await ReviewLog.create({
            userId: req.user._id,
            itemId: item._id,
            date: startOfDay(today),
            response,
            stageBefore,
            stageAfter: newStage
        });

        res.json(item);
    } catch (err) {
        next(err);
    }
};

export const getCalendarLoad = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) {
            return res
                .status(400)
                .json({ message: 'from and to date are required (YYYY-MM-DD).' });
        }

        const fromDate = startOfDay(new Date(from));
        const toDate = endOfDay(new Date(to));

        const items = await Item.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    nextReview: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$nextReview' }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = {};
        items.forEach((i) => {
            result[i._id] = i.count;
        });

        res.json(result);
    } catch (err) {
        next(err);
    }
};
