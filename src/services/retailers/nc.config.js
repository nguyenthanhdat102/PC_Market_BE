import dotenv from 'dotenv'
dotenv.config()

const baseUrl = "https://nguyencongpc.vn";

export default {
  retailerName: "Nguyễn Công PC",
  baseUrl,
  logoUrl: `${baseUrl}/media/lib/18-02-2025/logowhite-dfvefb.png`,
  categories: [
    { name: "VGA", path: `${baseUrl}/vga-card-man-hinh` },
    { name: "CPU", path: `${baseUrl}/cpu-bo-vi-xu-ly` },
    { name: "RAM", path: `${baseUrl}/ram` },
    { name: "MAIN", path: `${baseUrl}/mainboard-bo-mach-chu` },
    { name: "PSU", path: `${baseUrl}/psu-nguon-may-tinh` },
    // { name: "SSD", path: `${baseUrl}/o-cung-ssd` },
    // { name: "HDD", path: `${baseUrl}/o-cung-hdd` },
  ],
  selectors: {
    container: ".list-product-category",
    item: ".product-item",
    title: ".product-title",
    price: ".product-price-main",
    image: null,
    link: ".product-image",
  },
  pagination: {
    type: "page",
    param: "?page=",
    maxPages: parseInt(process.env.PAGE_LIMIT),
  },
};

