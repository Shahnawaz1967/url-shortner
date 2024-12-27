import express from 'express';
import { getUrlAnalytics, getTopicAnalytics, getOverallAnalytics } from '../controllers/analyticsController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/:alias', auth, getUrlAnalytics);
router.get('/topic/:topic', auth, getTopicAnalytics);
router.get('/overall', auth, getOverallAnalytics);

export default router;

