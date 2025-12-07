import puppeteer from "puppeteer";
import pLimit from "p-limit";
import { crawlRetailer } from "./services/index.js";

import ncpc from "./services/retailers/nc.config.js";
import kccshop from "./services/retailers/kccshop.config.js";
import pcm from "./services/retailers/pcm.config.js";

const retailers = [kccshop, ncpc, pcm];

export async function main() {
  console.log("🚀 Khởi động browser...");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1366, height: 768 },
  });

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
          console.error(`❌ [${retailer.retailerName}] Lỗi: ${err.message}`);
          return [];
        } finally {
          await page.close();
        }
      })
    )
  );

  await browser.close();

  const count = results.reduce((total, value) => total + value);
  console.log(
    `Đã crawler ${count} sản phẩm lúc ${new Date().toLocaleString()}`
  );
}
