import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashed });

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required.' });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: 'Invalid credentials.' });

        const token = generateToken(user._id);
        res.json({
            token,
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        next(err);
    }
};
