import prisma from "../../utils/prismaClient";
import { Prisma } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

// 가격 유효성 검사 함수 - 재사용성
export const validateProductPrice = (price: number): boolean => {
  return typeof price === "number" && price >= 0 && price <= 100000000;
};

interface CreateProductDTO {
  ownerId: string;
  ownerNickname: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
}
export const createProduct = async (productData: CreateProductDTO) => {
  const { ownerId, ownerNickname, name, description, price, tags, images } =
    productData;

  if (!validateProductPrice(price)) {
    throw new Error("상품 가격은 0원부터 1억원 사이로 입력해주세요.");
  }

  return await prisma.$transaction(async (tx) => {
    const newProduct = await tx.products.create({
      data: {
        id: uuidv4(),
        ownerId,
        ownerNickname,
        name,
        description,
        price,
        tags,
        images,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return newProduct;
  });
};

interface GetProductsOptions {
  page: number;
  pageSize: number;
  keyword: string;
  orderBy: string;
}

export const getProducts = async ({
  page,
  pageSize,
  keyword,
  orderBy,
}: GetProductsOptions) => {
  const skip = (page - 1) * pageSize;

  const where = keyword
    ? {
        name: {
          contains: keyword,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {};

  // orderBy 옵션 recent | favorite
  let orderByOption;
  switch (orderBy) {
    case "favorite": // 좋아요 수 기준 내림차순
      orderByOption = { likeCount: Prisma.SortOrder.desc };
      break;
    case "recent":
    default:
      orderByOption = { createdAt: Prisma.SortOrder.desc };
      break;
  }

  const [totalCount, list] = await Promise.all([
    prisma.products.count({ where }),
    prisma.products.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: orderByOption,
      select: {
        id: true,
        ownerId: true,
        ownerNickname: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        images: true,
        likeCount: true,
        createdAt: true,
      },
    }),
  ]);

  if (keyword) {
    console.log(`🔍 "${keyword}" 검색 결과: ${totalCount}개 `);
  }

  console.log(`📊 정렬 기준: ${orderBy}`);

  return {
    totalCount,
    list,
  };
};

export const getProductById = async (
  productId: string,
  currentUserId: string
) => {
  const product = await prisma.products.findUnique({
    where: { id: productId },
  });

  if (!product) return null;

  const user = await prisma.users.findUnique({
    where: { id: product.ownerId },
    select: { id: true, nickname: true },
  });

  // 현재 사용자가 좋아요를 눌렀는지
  const isLiked = currentUserId
    ? await prisma.likes.findFirst({
        where: {
          userId: currentUserId,
          resourceId: productId,
          resourceType: "product",
        },
      })
    : null;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    images: product.images,
    createdAt: product.createdAt,
    ownerId: product.ownerId,
    ownerNickname: product.ownerNickname || user?.nickname || "알 수 없음",
    likeCount: product.likeCount, //products 테이블의 값 사용
    isLiked: !!isLiked,
  };
};

/**
 * 상품에 좋아요 추가
 * @param productId 상품 ID
 * @param userId 사용자 ID
 * @returns 좋아요 추가 결과 및 업데이트된 좋아요 수
 */
export const addFavorite = async (productId: string, userId: string) => {
  if (!productId) {
    throw new Error("상품 ID가 필요합니다");
  }

  if (!userId) {
    throw new Error("사용자 ID가 필요합니다");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const product = await tx.products.findUnique({
        where: { id: productId },
        select: { id: true, likeCount: true, name: true },
      });

      if (!product) {
        throw new Error("상품을 찾을 수 없습니다");
      }

      // 이미 좋아요가 있는지
      const existing = await tx.likes.findFirst({
        where: {
          userId,
          resourceId: productId,
          resourceType: "product",
        },
      });

      // 이미 좋아요가 있으면 그대로 반환
      if (existing) {
        return {
          likeCount: product.likeCount,
          isLiked: true,
        };
      }

      // 좋아요 추가
      await tx.likes.create({
        data: {
          id: uuidv4(),
          userId,
          resourceId: productId,
          resourceType: "product",
        },
      });

      // products 테이블의 likeCount
      const updatedProduct = await tx.products.update({
        where: { id: productId },
        data: {
          likeCount: product.likeCount + 1,
        },
        select: { likeCount: true },
      });

      console.log(`👍`);

      return {
        likeCount: updatedProduct.likeCount,
        isLiked: true,
      };
    });
  } catch (error) {
    console.error("좋아요 추가 처리 중 오류:", error);

    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("좋아요 추가 중 알 수 없는 오류가 발생했습니다");
    }
  }
};

/**
 * 상품 좋아요 취소
 * @param productId 상품 ID
 * @param userId 사용자 ID
 * @returns 좋아요 취소 결과 및 업데이트된 좋아요 수
 */
export const removeFavorite = async (productId: string, userId: string) => {
  // 파라미터 유효성 검사
  if (!productId) {
    throw new Error("상품 ID가 필요합니다");
  }

  if (!userId) {
    throw new Error("사용자 ID가 필요합니다");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // 상품 존재 여부 확인
      const product = await tx.products.findUnique({
        where: { id: productId },
        select: { id: true, likeCount: true, name: true },
      });

      if (!product) {
        throw new Error("상품을 찾을 수 없습니다");
      }

      // 좋아요 정보 확인
      const existing = await tx.likes.findFirst({
        where: {
          userId,
          resourceId: productId,
          resourceType: "product",
        },
      });

      // 좋아요가 없으면 그대로 반환
      if (!existing) {
        return {
          likeCount: product.likeCount,
          isLiked: false,
        };
      }

      // 좋아요 삭제
      await tx.likes.delete({
        where: { id: existing.id },
      });

      // products 테이블의 likeCount 감소
      const updatedProduct = await tx.products.update({
        where: { id: productId },
        data: {
          likeCount: Math.max(0, product.likeCount - 1),
        },
        select: { likeCount: true },
      });

      console.log(`👎 `);

      // 프론트엔드 응답 형식에 맞게 반환
      return {
        likeCount: updatedProduct.likeCount,
        isLiked: false,
      };
    });
  } catch (error) {
    console.error("좋아요 취소 처리 중 오류:", error);

    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("좋아요 취소 중 알 수 없는 오류가 발생했습니다");
    }
  }
};

interface UpdateProductDTO {
  ownerId?: string;
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
  ownerNickname?: string;
}

export const updateProduct = async (
  productId: string,
  userId: string,
  data: UpdateProductDTO
) => {
  if (data.price !== undefined && !validateProductPrice(data.price)) {
    throw new Error("상품 가격은 0원부터 1억원 사이로 입력해주세요.");
  }

  return await prisma.$transaction(async (tx) => {
    const existingProduct = await tx.products.findUnique({
      where: { id: productId },
    });

    if (!existingProduct || existingProduct.ownerId !== userId) {
      throw new Error("수정 권한이 없거나 상품이 존재하지 않습니다.");
    }

    const cleanedData = Object.fromEntries(
      //undefined 값 제거
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    const updatedProduct = await tx.products.update({
      where: { id: productId },
      data: {
        ...cleanedData,
        updatedAt: new Date(),
      },
    });

    return updatedProduct;
  });
};

export const deleteProduct = async (productId: string, userId: string) => {
  const existing = await prisma.products.findUnique({
    where: { id: productId },
  });

  if (!existing) {
    return { success: false, message: "상품을 찾을 수 없습니다." };
  }

  if (existing.ownerId !== userId) {
    return {
      success: false,
      message: "삭제 권한이 없습니다. 자신이 등록한 상품만 삭제할 수 있습니다.",
    };
  }

  // 권한 확인 후 삭제 진행
  await prisma.products.delete({
    where: { id: productId },
  });

  return { success: true };
};
