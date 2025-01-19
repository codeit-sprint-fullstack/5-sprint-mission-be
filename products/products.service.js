import Product from "../models/Product.js";

export const getProduct = async (id) => {
  try {
    return await Product.findById(id).select(
      "id name description price tags createdAt"
    );
  } catch (error) {
    throw new Error("상품 찾기 실패 " + error.message);
  }
};

export const createProduct = async ({ name, description, price, tags }) => {
  try {
    const newProduct = new Product({ name, description, price, tags });
    return await newProduct.save();
  } catch (error) {
    throw new Error("상품 등록 실패 " + error.message);
  }
};

export const updateProduct = async (
  id,
  { name, images, description, price, tags }
) => {
  try {
    return await Product.findByIdAndUpdate(
      id,
      { name, images, description, price, tags },
      { new: true }
    );
  } catch (error) {
    throw new Error("상품 수정 실패 " + error.message);
  }
};

export const deleteProduct = async (id) => {
  try {
    return await Product.findByIdAndDelete(id);
  } catch (error) {
    throw new Error("상품 삭제 실패 " + error.message);
  }
};

export const getProducts = async (page, limit, search, orderBy) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const sort = orderBy === "recent" ? { createdAt: -1 } : { createdAt: 1 };

    return await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort)
      .select("id name price favoriteCount images createdAt");
  } catch (error) {
    throw new Error("상품 목록 조회 실패: " + error.message);
  }
};

//[ ] offset 방식의 페이지네이션 기능을 포함해 주세요. (클라이언트, 서버측 고려)
//[ ] 최신순(recent)으로 정렬할 수 있습니다.
//[ ] name, description에 포함된 단어로 검색할 수 있습니다.
// app.get("/products", async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 5,
//       sort = "createdAt",
//       order = "desc",
//       search = "",
//     } = req.query;

//     // 페이지네이션 계산
//     const skip = (page - 1) * limit;

//     // 정렬 옵션 처리 (최신순으로 정렬)
//     const sortOptions = {};
//     sortOptions[sort] = order === "asc" ? 1 : -1;

//     // name 또는 description 필드에서 검색어 검색
//     const searchOptions = search
//       ? {
//           $or: [
//             { name: new RegExp(search, "i") }, // name 필드에서 대소문자 구분 없이 검색
//             { description: new RegExp(search, "i") }, // description 필드에서 대소문자 구분 없이 검색
//           ],
//         }
//       : {};

//     // 상품 목록 조회 (검색 조건, 정렬, 페이지네이션 적용)
//     const products = await Product.find(searchOptions)
//       .select("id name price createdAt description")
//       .skip(skip)
//       .limit(parseInt(limit))
//       .sort(sortOptions);

//     // 결과가 없을 경우 처리
//     if (products.length === 0) {
//       return res.status(404).json({ message: "No products found." });
//     }

//     res.status(200).json({
//       message: "Products retrieved successfully.",
//       products,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       search: search || "None",
//       sort: sort || "createdAt",
//       order: order || "desc",
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error.", error: error.message });
//   }
// });
