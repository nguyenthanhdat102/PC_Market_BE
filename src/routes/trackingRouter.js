import express from "express";

import { priceTracking } from "../controllers/trackingCtrl.js";

const router = express.Router();

router.get("/tracking/:id", priceTracking);
// router.get("/test", trackingTest);

export default router;
