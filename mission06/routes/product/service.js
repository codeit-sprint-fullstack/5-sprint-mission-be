import Product from '../../models/Product.js';
import Counter from '../../models/Counter.js';

const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.find({ id: id });
    if (!product)
      res.status(404).send({ message: '아이디에 해당하는 상품이 없습니다.' });
    else res.status(200).send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: '알 수 없는 에러 발생!' });
  }
};

const getProductList = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, orderBy, keyword } = req.query;
    const sortOption = {
      createdAt: orderBy === 'old' ? 'asc' : 'desc',
    };
    const totalCount = (
      await Product.find(keyword ? { name: { $regex: keyword } } : {})
    ).length;
    const products = await Product.find(
      keyword ? { name: { $regex: keyword } } : {} // 나중에 atlas Search 이용해서 description도 해보자.
    )
      .sort(sortOption)
      .skip((Number(page) - 1) * Number(pageSize))
      .limit(Number(pageSize));
    if (!products[0])
      res.status(400).send({ message: '상품이 존재하지 않습니다.' });
    else res.status(200).send({ totalCount, list: products });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: '예기치 못한 오류 발생!' });
  }
};

const postProduct = async (req, res) => {
  try {
    const counter = await Counter.findOne({ countName: 'productId' });
    if (!counter || typeof counter.count !== 'number') {
      return res
        .status(500)
        .send({ message: 'Counter 값이 유효하지 않습니다.' });
    }
    const id = counter.count;
    const { images, tags, price, description, name } = req.body;
    if (
      !price ||
      !description ||
      !name ||
      isNaN(price) ||
      description.length < 10 ||
      description.length > 100 ||
      name.length > 10 ||
      name.length === 0 ||
      tags.find((tag) => tag.length > 5)
    ) {
      return res
        .status(404)
        .send({ message: 'body 조건을 만족하지 못했습니다.' });
    } else {
      const newProduct = await Product.create({
        id: id,
        images: images,
        tags: tags,
        price: price,
        description: description,
        name: name,
      });
      await Counter.updateOne(
        { countName: 'productId' },
        { $inc: { count: 1 } }
      );
      res.status(200).send(newProduct);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: '예기치 못한 오류 발생!' });
  }
};

const patchProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { images, tags, price, description, name } = req.body;
    if (
      !price ||
      !description ||
      !name ||
      isNaN(price) ||
      description.length < 10 ||
      description.length > 100 ||
      name.length > 10 ||
      name.length === 0 ||
      tags.find((tag) => tag.length > 5)
    ) {
      return res
        .status(404)
        .send({ message: 'body 조건을 만족하지 못했습니다.' });
    }
    else{
      const updatedProduct = await Product.findOneAndUpdate(
        { id: id },
        { images, tags, price, description, name },
        { new: true }
      );
      if (!updatedProduct) {
        return res
          .status(403)
          .send({ message: 'id에 해당하는 상품을 찾지 못했습니다.' });
      }
      else res.status(200).send(updatedProduct);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: '예기치 못한 오류 발생!' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete({ id: id });
    if (!deletedProduct)
      res.status(404).send({
        message: '해당 id 값과 일치하는 상품이 없어 삭제하지 못했습니다.',
      });
    res.status(200).send({ id: id });
  } catch (err) {}
};

const service = {
  getProduct,
  getProductList,
  postProduct,
  patchProduct,
  deleteProduct,
};
export default service;
