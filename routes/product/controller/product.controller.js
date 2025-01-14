import productService from "../service/product.service.js";

const addProduct = async (req, res) => {
  const { title, price, description, tags, imgUrl } = req.body;

  console.log(typeof title);

  if (!title || typeof title !== "string")
    return res
      .status(400)
      .send({ message: "Title is required and must be a string." });
  if (!price || typeof price !== "number")
    return res
      .status(400)
      .send({ message: "Price is required and must be a number." });
  if (!description || typeof description !== "string")
    return res
      .status(400)
      .send({ message: "Description is required and must be a string." });

  const product = await productService.addProduct({
    title,
    price,
    description,
    tags,
    imgUrl,
  });
  res.status(201).send(product);
};

const productController = {
  addProduct,
};

export default productController;
