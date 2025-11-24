import { Item } from '../models/Item.js';
import { ReviewLog } from '../models/ReviewLog.js';
import { startOfDay, endOfDay, addDays } from '../utils/spacedConfig.js';

export const getOverview = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        const todayStart = startOfDay(today);
        const todayEnd = endOfDay(today);

        const totalTopics = await Item.countDocuments({ userId });

        const dueToday = await Item.countDocuments({
            userId,
            nextReview: { $gte: todayStart, $lte: todayEnd }
        });

        const reviewedToday = await ReviewLog.countDocuments({
            userId,
            date: { $gte: todayStart, $lte: todayEnd }
        });

        // streak: consecutive days up to today with at least one review
        let streakDays = 0;
        let cursor = startOfDay(today);

        // limit streak computation to last 60 days for sanity
        for (let i = 0; i < 60; i++) {
            const dayStart = startOfDay(cursor);
            const dayEnd = endOfDay(cursor);
            const count = await ReviewLog.countDocuments({
                userId,
                date: { $gte: dayStart, $lte: dayEnd }
            });

            if (count > 0) {
                streakDays += 1;
                cursor = addDays(cursor, -1);
            } else {
                break;
            }
        }

        res.json({
            totalTopics,
            dueToday,
            reviewedToday,
            streakDays
        });
    } catch (err) {
        next(err);
    }
};
