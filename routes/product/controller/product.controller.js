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

const fetchProductList = async (req, res) => {
  const { page, pageSize, orderBy, keyword } = req.query;
  console.log(
    `fetch product list :: page(${page}), pageSize(${pageSize}), orderBy(${orderBy}), keyword(${keyword})`
  );

  const skip = (page - 1) * pageSize;

  const searchRegex = new RegExp(keyword, "i");
  const query = {
    $or: [
      { title: searchRegex }, // 제목 검색
      { description: searchRegex }, // 설명 검색
      { tags: searchRegex }, // 태그 검색 (배열일 경우 지원)
    ],
  };

  try {
    const productList = await productService.fetchProductList(
      query,
      skip,
      pageSize,
      orderBy
    );
    const totalCount = await productService.fetchProductCount();
    res.status(200).send({ list: productList, totalCount });
  } catch (err) {
    console.log(`Error API in GET '/products' | message::${err.message}`);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const productController = {
  addProduct,
  fetchProductList,
};

export default productController;
