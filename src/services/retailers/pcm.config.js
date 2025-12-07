const baseUrl = "https://pcmarket.vn";

export default {
  retailerName: "PC Market",
  baseUrl,
  logoUrl: `${baseUrl}/static/assets/2021/images/logo-new.png`,
  categories: [
    { name: "VGA", path: `${baseUrl}/vga-card-man-hinh.html` },
    { name: "CPU", path: `${baseUrl}/cpu-bo-vi-xu-ly.html` },
    { name: "RAM", path: `${baseUrl}/ram-bo-nho-trong.html` },
    { name: "MAIN", path: `${baseUrl}/mainboard-bo-mach-chu.html` },
    { name: "PSU", path: `${baseUrl}/psu-nguon-may-tinh.html` },
    // { name: "SSD", path: `${baseUrl}/o-cung-ssd.html` },
    // { name: "HDD", path: `${baseUrl}/o-cung-hdd.html` },
  ],
  selectors: {
    container: ".product_list",
    item: ".p-item",
    title: ".p-name",
    price: ".p-price",
    image: null,
    link: ".p-img",
  },
  pagination: {
    type: "page",
    param: "?page=",
    maxPages: 100,
  },
};
