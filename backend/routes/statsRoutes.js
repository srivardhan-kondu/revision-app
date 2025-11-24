import express from 'express';
import { getOverview } from '../Controllers/statsController.js';

const router = express.Router();

router.get('/overview', getOverview);

export default router;
