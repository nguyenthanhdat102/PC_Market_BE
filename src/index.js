import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRouter from "./routes/productRouter.js";
import trackingRouter from "./routes/trackingRouter.js";
import cron from "node-cron";
import TelegramBot from "node-telegram-bot-api";

import { main } from "./app.js";
import { sendTeleGram } from "./utils/sendNotification.js";

dotenv.config();

const app = express();
//Middleware can read json
app.use(express.json());
app.use(cors());

await connectDB();

cron.schedule("0 6 * * *", () => {
  sendTeleGram(`🕕 Bắt đầu lấy dữ liệu ${new Date().toLocaleString()}`);
  main();
});

app.use("/api/v1", productRouter);
app.use("/api/v1", trackingRouter);

app.listen(process.env.PORT, () => {
  try {
    console.log(`Máy chủ đang chạy tại http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.log(err);
  }
});
