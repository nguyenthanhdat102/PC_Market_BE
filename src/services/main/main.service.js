import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium-min";
import pLimit from "p-limit";
import { crawlRetailer } from "../index.js";
import dotenv from "dotenv";
dotenv.config();
import ncpc from "../retailers/nc.config.js";
import kccshop from "../retailers/kccshop.config.js";
import pcm from "../retailers/nc.config.js";
import telegrambotService from "../telegram/telegrambot.service.js";

const retailers = [ncpc];

class mainService {
  async main() {
    const startTime = Date.now();
    try {
      await telegrambotService.notifyStart();

      const results = await this.process();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);

      // Thông báo thành công về telegram
      await telegrambotService.notifySuccess({
        duration: duration,
        processed: results.total || 0,
        success: true,
        failed: results.failed || 0,
        message: results.message || "Xử lý hoàn tất",
      });

      return {
        success: true,
        duration: duration,
        message: results.message,
      };
    } catch (error) {
      console.error("❌ Main function error:", error.message);
      // Thông báo lỗi
      await telegrambotService.notifyError(error, "Main Function");
      throw error;
    }
  }

  async process() {
    console.log("🚀 Khởi động browser...");
    try {
      let browser;
      if (process.env.NODE_ENV !== "development") {
        browser = await puppeteerCore.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(
            process.env.REMOTE_EXE_PATH
          ),
          headless: true,
        });
      } else {
        browser = await puppeteer.launch({
          headless: true,
        });
      }

      // Giới hạn số tab chạy song song
      const limit = pLimit(3);

      // Chạy song song mỗi retailer trong 1 tab riêng
      const results = await Promise.all(
        retailers.map((retailer) =>
          limit(async () => {
            const page = await browser.newPage();
            try {
              return await crawlRetailer(page, retailer);
            } catch (err) {
              console.error(
                `❌ [${retailer.retailerName}] Lỗi: ${err.message}`
              );
              return [];
            } finally {
              await page.close();
            }
          })
        )
      );

      await browser.close();
      const count = results.reduce((total, value) => total + value);
      const time = new Date().toLocaleString();

      console.log(`Đã crawler ${count} sản phẩm lúc ${time}`);
      return {
        total: count,
        success: true,
        message: `Đã crawler ${count} sản phẩm lúc ${time}`,
      };
    } catch (error) {
      console.error("❌ Main function error:", error.message);
      // Thông báo lỗi
      await telegrambotService.notifyError(error, "Main Function");
      throw error;
    }
  }
}

export default new mainService();
