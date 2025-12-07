import mongoose from "mongoose";
import PriceHistory from "../models/PriceHistory.js";
import Product from "../models/Product.js";

export const priceTracking = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Id invalid" });
    }
    // 1. Tìm product để lấy thông tin retailer
    const product = await Product.findById(id).populate("retailer");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Lấy toàn bộ lịch sử giá theo productId
    const priceHistory = await PriceHistory.find({ productId: id }).sort({
      date: 1,
    }); // sort tăng theo thời gian

    return res.json({
      title: product.title,
      imgurl: product.imgurl,
      currentPrice: product.currentPrice,
      lastPrice: product.lastPrice,
      history: priceHistory.map((i) => ({
        date: i.date,
        price: i.price,
      })),
    });
  } catch (err) {
    console.error("Price tracking error:", err);
    sendTeleGram(`❌ Price tracking error: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
