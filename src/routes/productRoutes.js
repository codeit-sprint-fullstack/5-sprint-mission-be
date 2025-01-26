import e from "express";
import productController from "../controllers/productController.js";

const productRouter = e.Router();

productRouter.post("/", productController.addProduct);
productRouter.get("/", productController.getProducts);
productRouter.get("/:id", productController.getProductById);
productRouter.patch("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);

export default productRouter;
