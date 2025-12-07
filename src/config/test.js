import mongoose from "mongoose";
import dotenv from "dotenv";
import Retailer from "../models/Retailer.js";
import PriceHistory from "../models/PriceHistory.js";
import Product from "../models/Product.js";
import slug from "slug";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

// Seed dữ liệu retailer ban đầu
const seedRetailers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // const retailers = [
    //   {
    //     name: "Nguyễn Công PC",
    //     baseUrl: "https://nguyencongpc.vn",
    //     logoUrl: "/media/lib/18-02-2025/logowhite-dfvefb.png",
    //     slug: slug("Nguyễn Công PC"),
    //   },
    //   {
    //     name: "KCC Shop",
    //     baseUrl: "https://kccshop.vn",
    //     logoUrl: "/media/banner/logo_Logo%20d%C3%A0i%20Cam.png",
    //     slug: slug("KCC Shop"),
    //   },
    //   {
    //     name: "PC Market",
    //     baseUrl: "https://pcmarket.vn",
    //     logoUrl: "/static/assets/2021/images/logo-new.png",
    //     slug: slug("PC Market"),
    //   },
    // ];

    // await Retailer.deleteMany({});
    // await Retailer.insertMany(retailers);

    await PriceHistory.deleteMany({});
    await Product.deleteMany({});

    console.log("🌱 Run scripts successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Run scripts:", error);
    process.exit(1);
  }
};

seedRetailers();
