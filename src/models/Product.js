//Schema Product
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, require: true },
    category: { type: String, required: true },
    specs: { type: Map, default: {} },
    retailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Retailer",
      required: true,
    },
    url: { type: String, required: true, unique: true },
    imgurl: { type: String },
    currentPrice: { type: Number, required: true },
    lastPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
