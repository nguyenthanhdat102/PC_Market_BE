import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
//Middleware can read json
app.use(express.json());
app.use(cors());

await connectDB();

routes(app);

app.listen(process.env.PORT, () => {
  try {
    console.log(`Máy chủ đang chạy tại http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.log(err);
  }
});
