import express from 'express';
import {
    createItem,
    getDueItems,
    reviewItem,
    getCalendarLoad
} from '../Controllers/itemController.js';

const router = express.Router();

router.post('/', createItem);
router.get('/due', getDueItems);
router.post('/:id/review', reviewItem);
router.get('/calendar', getCalendarLoad);

export default router;
