import express from 'express';
import cronController from '../controllers/cronCtrl.js';

const router = express.Router()

// Endpoint cho Vercel Cron
router.post('/scheduled', cronController.runScheduledTask);

// Endpoint để test thủ công
router.post('/manual', cronController.runManualTask);

export default router