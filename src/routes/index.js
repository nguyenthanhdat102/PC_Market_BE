import dotenv from "dotenv";
dotenv.config();
import mainService from "../services/main/main.service.js";
import productRoutes from "./productRouter.js";
import trackingRoutes from "./trackingRouter.js";
import telegramRoutes from "./telegramRouter.js";
import cronRoutes from "./cronRouter.js";

const API_ROUTE = "/api";

export default function (app) {
  app.use(`${API_ROUTE}/v1`, productRoutes);
  app.use(`${API_ROUTE}/v1`, trackingRoutes);
  // Telegram routes
  app.use(`${API_ROUTE}/telegram`, telegramRoutes);
  // Cron routes
  app.use(`${API_ROUTE}/cron`, cronRoutes);

  // Test health
  app.get(`${API_ROUTE}/health`, (req, res) => {
    res.json({
      status: "OK",
      time: new Date().toISOString(),
    });
  });
  //test cron
  app.get(`${API_ROUTE}/test-cron`, async (req, res) => {
    await mainService.main();
    res.json({ success: true, message: "Test cron executed" });
  });
}
