import Retailer from "../../models/Retailer.js";
import Product from "../../models/Product.js";
import PriceHistory from "../../models/PriceHistory.js";
import slug from "slug";
import { sendTeleGram } from "../../utils/sendNotification.js";

export async function saveCrawledItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    console.log("⚠️ Không có item nào để lưu.");
    return;
  }

  let savedCount = 0;

  for (const item of items) {
    try {
      if (!item.title || !item.price || !item.url) {
        console.warn("❌ Bỏ qua item thiếu dữ liệu:", item.title);
        continue;
      }

      // Retailer
      const retailerDoc = await Retailer.findOneAndUpdate(
        { name: item.retailer },
        { name: item.retailer },
        { upsert: true, new: true }
      );

      // Kiểm tra tồn tại
      const existProduct = await Product.findOne({ url: item.url });
      const productData = {
        retailer: retailerDoc._id,
        title: item.title,
        slug: slug(item.title),
        category: item.category,
        specs: item.specs,
        url: item.url,
        imgurl: item.image,
        currentPrice: item.price,
      };

      // Thay đổi giá cũ nếu giá thay đổi
      if (existProduct) {
        //Nếu giá cũ khác giá mới thì lưu lại
        if (existProduct.currentPrice !== item.price) {
          productData.lastPrice = existProduct.currentPrice;
        } else {
          productData.lastPrice = existProduct.lastPrice;
        }
      } else {
        productData.lastPrice = item.price;
      }

      // Product thêm mới hoặc cập nhật giá mới
      const productDoc = await Product.findOneAndUpdate(
        { url: item.url },
        productData,
        { upsert: true, new: true }
      );

      // 4️⃣ PriceHistory
      const lastPrice = await PriceHistory.findOne({
        productId: productDoc._id,
      }).sort({ date: -1 }); // lấy bản ghi mới nhất

      if (!lastPrice || lastPrice.price !== item.price) {
        // chỉ lưu khi giá khác
        await PriceHistory.create({
          productId: productDoc._id,
          price: item.price,
          date: new Date(),
        });
      }

      savedCount++;
    } catch (err) {
      console.error(`⚠️ Lỗi khi lưu item "${item.title}":`, err.message);
      sendTeleGram(`⚠️ Lỗi khi lưu item "${item.title}": ${err.message}`);
    }
  }

  console.log(`✅ Đã lưu ${savedCount}/${items.length} sản phẩm thành công.`);
}
