import dotenv from 'dotenv';
dotenv.config()
import mainService from '../services/main/main.service.js';

import productRoutes from "./productRouter.js";
import trackingRoutes from "./trackingRouter.js";
import telegramRoutes from "./telegramRouter.js";
import cronRoutes from "./cronRouter.js";

export default function (app) {
  app.use("/api/v1", productRoutes);
  app.use("/api/v1", trackingRoutes);
  // Telegram routes
  app.use("/telegram", telegramRoutes);
  // Cron routes
  app.use("/cron", cronRoutes);

  // Test health
  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      time: new Date().toISOString(),
    });
  });

  // Chỉ có ở development
  if (process.env.NODE_ENV === "development") {
    app.get("/test-cron", async (req, res) => {
      await mainService.main();
      res.json({ success: true, message: "Test cron executed" });
    });
  }
}
