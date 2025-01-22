import productService from "../service/product.service.js";

const fetchProductList = async (req, res) => {
  const {
    page = 1,
    pageSize = 10,
    orderBy = "recent",
    keyword = "",
  } = req.query;
  console.log(
    `fetch product list :: page(${page}), pageSize(${pageSize}), orderBy(${orderBy}), keyword(${keyword})`
  );

  try {
    const productList = await productService.fetchProductList(
      page,
      pageSize,
      orderBy,
      keyword
    );
    const totalCount = await productService.fetchProductCount(keyword);
    res.status(200).send({ list: productList, totalCount });
  } catch (err) {
    console.log(`Error API in GET '/products' | message::${err.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const addProduct = async (req, res) => {
  const { title, price, description, tags, imgUrl } = req.body;

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

  try {
    const product = await productService.addProduct({
      title,
      price,
      description,
      tags,
      imgUrl,
    });
    res.status(201).send(product);
  } catch (err) {
    console.log(`Error API in POST '/products' | message::${err.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const productRouter = {
  fetchProductList,
  addProduct,
};
export default productRouter;
