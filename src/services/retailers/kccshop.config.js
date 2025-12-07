const baseUrl = "https://kccshop.vn";

export default {
  retailerName: "KCC Shop",
  baseUrl,
  logoUrl: `${baseUrl}/media/lib/18-02-2025/logowhite-dfvefb.png`,
  categories: [
    { name: "VGA", path: `${baseUrl}/vga-card-man-hinh` },
    { name: "CPU", path: `${baseUrl}/cpu-bo-vi-xu-ly` },
    { name: "RAM", path: `${baseUrl}/ram-bo-nho-trong` },
    { name: "MAIN", path: `${baseUrl}/main-bo-mach-chu` },
    { name: "PSU", path: `${baseUrl}/psu-nguon-may-tinh` },
    // { name: "SSD", path: `${baseUrl}/o-cung-the-ran-ssd` },
    // { name: "HDD", path: `${baseUrl}/o-cung-hdd` },
  ],
  selectors: {
    container: ".box-list-category",
    item: ".product.p-item",
    title: ".p-name",
    price: ".p-price",
    image: null,
    link: ".p-img",
  },
  pagination: {
    type: "page",
    param: "/?page=",
    maxPages: 100,
  },
};
