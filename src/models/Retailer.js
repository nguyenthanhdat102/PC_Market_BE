import mongoose from "mongoose";

const retailerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // VD: KCCShop, GearVN
    slug: { type: String, require: true },
    baseUrl: { type: String, required: true },
    logoUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Retailer", retailerSchema);
