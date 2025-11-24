import express from 'express';
import {
    getSubjects,
    createSubject
} from '../Controllers/subjectController.js';

const router = express.Router();

router.get('/', getSubjects);
router.post('/', createSubject);

export default router;
