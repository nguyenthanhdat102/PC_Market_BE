import dotenv from 'dotenv'
import { saveCrawledItems } from './services/db/saveCrawled.js';
import { connectDB } from './config/db.js';
import Product from './models/Product.js';


dotenv.config();

await connectDB()

const fakeData = [
  {
    title:
      "CPU Test chức năng",
    price: 9999999,
    image: "https://kccshop.vn/media/product/250-4408-2.jpg",
    url: "https://kccshop.vn/cpu-amd-ryzen-9-7900-3-7-ghz-upto-5-4ghz-76mb-12-cores-24-threads-65w-socket-am5/",
    category: "CPU",
    retailer: "KCC Shop",
    specs: {
      brand: "AMD",
      line: "RYZEN 9",
      model: "7900",
      suffix: null,
    },
  },
  {
    title:
      "CPU Intel Core i5 10400 TEST",
    price: 8888888,
    image:
      "https://kccshop.vn/media/product/250-175-52658_intel_core_i5_10600_100.jpg",
    url: "https://kccshop.vn/cpu-intel-core-i5-10400-2-90-up-to-4-10ghz-12m-6-cores-12-threads-hang-chinh-hang/",
    category: "CPU",
    retailer: "KCC Shop",
    specs: {
      brand: "INTEL",
      line: "I5",
      model: "10400",
      suffix: null,
    },
  },
];


await saveCrawledItems(fakeData)

console.log("XONG")