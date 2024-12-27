import express from 'express';
import { createShortUrl, redirectToLongUrl } from '../controllers/urlController.js';
import { auth } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { validateCreateShortUrl } from '../validators/urlValidators.js';

const router = express.Router();

router.post('/', auth, rateLimiter, validateCreateShortUrl, createShortUrl);
router.get('/:alias', redirectToLongUrl);

export default router;

