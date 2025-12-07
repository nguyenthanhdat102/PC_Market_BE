import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now, index: true },
});

export default mongoose.model("PriceHistory", priceHistorySchema);
