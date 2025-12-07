import express from "express";

import { getAllProducts, getProduct } from "../controllers/productCtrl.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/product/:id", getProduct);
// router.get("/productsGroup", getAllProductsByGroup);

export default router;
