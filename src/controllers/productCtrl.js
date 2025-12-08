import Product from "../models/Product.js";

// GET /api/products?cursor=:cursor&limit=:limit
export const getAllProducts = async (req, res) => {
  const {
    page = 1,
    limit = 30,
    sortBy = "descending",
    category = "",
    search = "",
  } = req.query;
  try {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    if (category) {
      query.category = category?.toUpperCase();
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // danh sách các lựa chọn sắp xếp
    let sortOption = {};
    if (!search || sortBy !== "relevance") {
      switch (sortBy) {
        case "ascending":
          sortOption = { createdAt: 1 };
          break;
        case "descending":
          sortOption = { createdAt: -1 };
          break;
        case "priceAsc":
          sortOption = { currentPrice: 1 };
          break;
        case "priceDesc":
          sortOption = { currentPrice: -1 };
          break;
        case "priceChange":
          sortOption = { currentPrice: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
          break;
      }
    }

    // Lấy danh sách sản phẩm
    const products = await Product.find(query)
      .populate("retailer")
      .sort(sortOption)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit); // làm tròn

    res.json({
      totalProducts,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      hasNextPage: parseInt(page) < totalPages && totalPages !== 0,
      hasPrevPage: parseInt(page) > 1 && totalPages !== 0,
      products,
    });
  } catch (err) {
    console.error("❌ Lỗi hàm getAllProducts:", err.message);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.find({ _id: id });
    res.json(product);
  } catch (err) {
    console.error("❌ Lỗi hàm getProduct:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
