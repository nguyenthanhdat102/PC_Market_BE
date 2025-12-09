import express from "express";
import telegramController from "../controllers/telegramCtrl.js";

const router = express.Router();

// Endpoint telegram tự động gửi qua /webhook này
router.post("/webhook", telegramController.handleWebhook);
// chạy 1 lần để setup webhook api telegram
router.post("/setup", telegramController.setupWebhook);
// check xem được chưa
router.get("/info", telegramController.getWebhookInfo);

export default router;
