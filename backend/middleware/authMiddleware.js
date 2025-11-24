import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authRequired = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;

        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid token' });
    }
};
