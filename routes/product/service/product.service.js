import prisma from "../../../prismaClient.js";

const fetchProductList = async (page, pageSize, orderBy, keyword) => {
  const skip = (page - 1) * pageSize;
  const orderByOption =
    orderBy === "favorite" ? { favoriteCnt: "desc" } : { createdAt: "desc" };

  return await prisma.products.findMany({
    skip,
    take: pageSize,
    where: {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { tags: { hasSome: [keyword] } },
      ],
    },
    orderBy: orderByOption,
  });
};

const fetchProductCount = async (keyword) => {
  return await prisma.products.count({
    where: {
      OR: [
        { title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { tags: { hasSome: [keyword] } },
      ],
    },
  });
};

const addProduct = async ({ title, price, description, tags, imgUrl }) => {
  try {
    return await prisma.products.create({
      data: { title, price, description, tags, imgUrl },
    });
  } catch (err) {
    throw new Error(`- Database error while add product :: ${err.message}`);
  }
};

const existProduct = async (id) => {
  try {
    const product = await prisma.products.findUnique({
      where: {
        id,
      },
    });
    return !!product;
  } catch (err) {
    throw new Error(`- Database error while exist product :: ${err.message}`);
  }
};

const productService = {
  fetchProductList,
  fetchProductCount,
  addProduct,
  existProduct,
};

export default productService;
