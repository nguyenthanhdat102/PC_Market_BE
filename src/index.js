import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import productRouter from "./routes/productRouter.js";
import trackingRouter from "./routes/trackingRouter.js";
import cron from "node-cron";

import { main } from "./app.js";

dotenv.config();

const app = express();
//Middleware can read json
app.use(express.json());
app.use(cors());

await connectDB();
main();
cron.schedule("0 6 * * *", () => {
  main();
});


app.use("/api/v1", productRouter);
app.use("/api/v1", trackingRouter);

app.listen(process.env.PORT, () => {
  try {
    console.log(`Máy chủ đang chạy tại http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.log(err);
  }
});
