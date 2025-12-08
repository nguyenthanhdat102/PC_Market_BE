import express from 'express';
import telegramController from '../controllers/telegramCtrl.js';

const router = express.Router()

router.post('/webhook', telegramController.handleWebhook);
router.post('/setup', telegramController.setupWebhook);
router.get('/info', telegramController.getWebhookInfo);

export default router