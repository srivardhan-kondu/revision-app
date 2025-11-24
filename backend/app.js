import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { authRequired } from './middleware/authMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: process.env.FRONTEND_ORIGIN,
        credentials: true
    })
);

app.get('/', (req, res) => {
    res.json({ message: 'Spaced revision API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/subjects', authRequired, subjectRoutes);
app.use('/api/items', authRequired, itemRoutes);
app.use('/api/stats', authRequired, statsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
