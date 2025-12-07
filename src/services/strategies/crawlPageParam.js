import randomDelay from "../../utils/randomDelay.js";
import { parseSpecs } from "../regex/specsPaser.js";
import { saveCrawledItems } from "../db/saveCrawled.js";

export async function crawlByPageParam(page, retailerConfig) {
  const { baseUrl, categories, selectors, pagination, retailerName } =
    retailerConfig;
  const { container, item } = selectors;
  const { param, maxPages } = pagination;

  let count = 0;
  
  // Lặp qua các danh mục VGA, CPU,...
  for (const category of categories) {
    console.log(`🟢 Crawling category: ${category.name}`);

    // Lặp qua các trang trong một danh mục
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const url = `${category.path}${param}${pageNum}`;
      console.log(`  🌐 Page ${pageNum}: ${url}`);

      // ✅ thêm delay ngẫu nhiên trước khi vào trang
      const delay = randomDelay();
      console.log(`  ⏳ Chờ ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));

      try {
        await page.goto(url, {
          waitUntil: ["domcontentloaded", "networkidle2"],
          timeout: 60000,
        });
      } catch (err) {
        console.log(`  ⚠ Lỗi khi tải trang: ${err.message}`);
        continue;
      }

      // ✅ chờ container render xong
      try {
        await page.waitForSelector(container, { timeout: 8000 });
      } catch {
        console.log("  ❌ Không tìm thấy container, dừng crawl category này.");
        break;
      }

      // ✅ kiểm tra số lượng item
      const itemsCount = await page
        .$$eval(`${container} ${item}`, (els) => els.length)
        .catch(() => 0);

      if (itemsCount === 0) {
        console.log("  ⚪ Container tồn tại nhưng không có item, dừng crawl.");
        break;
      }

      // ✅ lấy danh sách sản phẩm
      const products = await page.$$eval(
        `${container} ${item}`,
        (els, selectors, baseUrl, categoryName, retailerName) => {
          const {
            title: titleSel,
            price: priceSel,
            image: imageSel,
            link: linkSel,
          } = selectors;

          // helper: lấy text an toàn
          const getText = (root, sel) => {
            if (!sel) return null;
            const el = root.querySelector(sel);
            return el ? el.innerText.trim() : null;
          };

          // helper: lấy attribute an toàn
          const getAttr = (root, sel, attr) => {
            if (!sel) return null;
            const el = root.querySelector(sel);
            return el ? el.getAttribute(attr) : null;
          };

          // normalize một item -> object
          const normalize = (el) => {
            const name = getText(el, titleSel);
            const priceText = getText(el, priceSel);
            const linkEl = linkSel
              ? el.querySelector(linkSel)
              : el.querySelector("a");
            const rawHref = linkEl ? linkEl.getAttribute("href") || null : null;

            // ảnh: dùng selector image nếu có, ngược lại lấy img trong item/link
            let image = null;
            if (imageSel) {
              image =
                getAttr(el, imageSel, "data-src") ||
                getAttr(el, imageSel, "src");
            }
            if (!image && linkEl) {
              const img =
                linkEl.querySelector("img") || el.querySelector("img");
              if (img)
                image = img.getAttribute("data-src") || img.getAttribute("src");
            }

            // sạch price: chỉ giữ số
            const numeric = priceText ? priceText.replace(/[^\d]/g, "") : "";
            const price = numeric ? Number(numeric) : NaN;

            // build final url
            const url = rawHref ? new URL(rawHref, baseUrl).href : null;

            // kiểm tra tối thiểu
            if (!name || !url || !Number.isFinite(price) || price <= 0)
              return null;

            return {
              title: name,
              price,
              image: baseUrl + image || null,
              url,
              category: categoryName,
              retailer: retailerName,
            };
          };

          return Array.from(els)
            .map(normalize)
            .filter((x) => x !== null);
        },
        selectors,
        baseUrl,
        category.name, // Truyền tên danh mục từ config vào đây
        retailerName
      );

      // kiểm tra và lọc (Ở đây products đã là array item hợp lệ)
      if (!products || products.length === 0) {
        console.log("  ⚪ Không còn sản phẩm, dừng crawl.");
        break;
      }
      // Log số sản phẩm lấy được trong một trang
      console.log(`  ✅ Lấy được ${products.length} sản phẩm`);

      // Cộng vào bộ đếm
      count = count + products.length;

      // Lặp qua mảng products bổ sung specs cho từng product
      products.forEach((product) => {
        const { title, category } = product;
        product.specs = parseSpecs(title, category);
      });

      //Lưu lại ngay sau khi đã lấy thông tin đầy đủ từ một trang
      try {
        console.log("  Đang lưu vào database...");
        await saveCrawledItems(products);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return count;
}
