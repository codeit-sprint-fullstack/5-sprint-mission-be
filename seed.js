import mongoose from "mongoose";
import Product from "./models/product.js";
import productData from "./data/productData.js";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL);
await Product.deleteMany({});
await Product.insertMany(productData);
console.log("완료");
mongoose.connection.close();
