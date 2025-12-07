import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
  polling: false,
});

const CHAT_ID = process.env.CHAT_ID;

export async function sendTeleGram(message) {
  if (!CHAT_ID) {
    console.error("❌ ERROR: Chưa cấu hình TELEGRAM_CHAT_ID trong .env");
    return;
  }

  try {
    await bot.sendMessage(CHAT_ID, message);
  } catch (err) {
    console.error("❌ Lỗi gửi Telegram:", err.message);
  }
}
