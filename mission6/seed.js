import mongoose from "mongoose";
import productData from "./seedData/productData.js";
import Product from "./models/Product.js";
import * as dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.DATABASE_URL);

await Product.deleteMany({});
await Product.insertMany(productData);

mongoose.connection.close();
