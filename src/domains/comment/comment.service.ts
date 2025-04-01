import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 댓글 타입 정의
export interface CommentWithUser {
  id: string;
  content: string;
  resourceId: string; // 상품 ID 또는 게시글 ID
  resourceType: string; // "PRODUCT" 또는 "ARTICLE"
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  user: {
    id: string;
    nickname: string;
    image?: string | null;
  };
}

// 댓글 생성 입력 타입
interface CreateCommentInput {
  productId: string; // 상품 ID
  userId: string; // 사용자 ID
  content: string; // 댓글 내용
}

// 댓글 수정 입력 타입
interface UpdateCommentInput {
  content: string;
}

// 댓글 조회 파라미터 타입
interface GetCommentsParams {
  productId: string;
  page: number;
  pageSize: number;
}

/**
 * 댓글 생성
 * @param data 생성할 댓글 데이터
 * @returns 생성된 댓글 (사용자 정보 포함)
 */
export const createComment = async (
  data: CreateCommentInput
): Promise<CommentWithUser> => {
  // 상품 존재 여부 확인
  const product = await prisma.products.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    throw new Error("상품을 찾을 수 없습니다.");
  }

  // 사용자 존재 여부 확인
  const user = await prisma.users.findUnique({
    where: { id: data.userId },
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  });

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  // 댓글 생성 - resourceId와 resourceType 명시적 설정
  const comment = await prisma.comments.create({
    data: {
      content: data.content,
      userId: data.userId,
      resourceId: data.productId, // 상품 ID를 resourceId로 설정
      resourceType: "PRODUCT", // 리소스 타입을 "PRODUCT"로 설정
    },
  });

  // 댓글과 사용자 정보 결합
  return {
    ...comment,
    user: {
      id: user.id,
      nickname: user.nickname,
      image: user.image,
    },
  };
};

/**
 * 댓글 ID로 조회
 * @param commentId 댓글 ID
 * @returns 댓글 (사용자 정보 포함) 또는 null
 */
export const getCommentById = async (
  commentId: string
): Promise<CommentWithUser | null> => {
  const comment = await prisma.comments.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    return null;
  }

  // 사용자 정보 조회
  const user = await prisma.users.findUnique({
    where: { id: comment.userId },
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  });

  if (!user) {
    throw new Error("댓글 작성자 정보를 찾을 수 없습니다.");
  }

  // 댓글과 사용자 정보 결합
  return {
    ...comment,
    user: {
      id: user.id,
      nickname: user.nickname,
      image: user.image,
    },
  };
};

/**
 * 댓글 수정
 * @param commentId 수정할 댓글 ID
 * @param data 수정할 내용
 * @returns 수정된 댓글 (사용자 정보 포함)
 */
export const updateComment = async (
  commentId: string,
  data: UpdateCommentInput
): Promise<CommentWithUser> => {
  const updatedComment = await prisma.comments.update({
    where: { id: commentId },
    data: {
      content: data.content,
      updatedAt: new Date(),
    },
  });

  // 사용자 정보 조회
  const user = await prisma.users.findUnique({
    where: { id: updatedComment.userId },
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  });

  if (!user) {
    throw new Error("댓글 작성자 정보를 찾을 수 없습니다.");
  }

  // 댓글과 사용자 정보 결합
  return {
    ...updatedComment,
    user: {
      id: user.id,
      nickname: user.nickname,
      image: user.image,
    },
  };
};

/**
 * 댓글 삭제
 * @param commentId 삭제할 댓글 ID
 * @returns 삭제 성공 여부
 */
export const deleteComment = async (commentId: string): Promise<boolean> => {
  await prisma.comments.delete({
    where: { id: commentId },
  });

  return true;
};

/**
 * 상품별 댓글 조회 (페이징)
 * @param params 조회 파라미터 (상품ID, 페이지, 페이지 크기)
 * @returns 댓글 목록과 총 개수
 */
export const getCommentsByProductId = async (
  params: GetCommentsParams
): Promise<{ list: CommentWithUser[]; totalCount: number }> => {
  const { productId, page, pageSize } = params;

  console.log("서비스에서 받은 상품 ID:", productId); // 디버깅용 로그 추가

  if (!productId) {
    throw new Error("상품 ID가 필요합니다.");
  }

  // 상품 존재 여부 확인 - findUnique는 ID가 null이면 안됨
  const product = await prisma.products.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("상품을 찾을 수 없습니다.");
  }

  // 페이지네이션을 위한 건너뛰기 계산
  const skip = (page - 1) * pageSize;

  // 댓글 목록 조회 (최신순) - resourceId와 resourceType으로 필터링
  const comments = await prisma.comments.findMany({
    where: {
      resourceId: productId,
      resourceType: "PRODUCT",
    },
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  // 댓글 작성자 ID 목록 추출
  const userIds = [...new Set(comments.map((comment) => comment.userId))];

  // 사용자 정보 일괄 조회 (N+1 문제 방지)
  const users = await prisma.users.findMany({
    where: { id: { in: userIds } },
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  });

  // 사용자 ID를 키로 하는 맵 생성
  const userMap = new Map(users.map((user) => [user.id, user]));

  // 댓글과 사용자 정보 결합
  const list = comments.map((comment) => ({
    ...comment,
    user: userMap.get(comment.userId) || {
      id: comment.userId,
      nickname: "알 수 없음",
      image: null,
    },
  }));

  // 총 댓글 수 조회
  const totalCount = await prisma.comments.count({
    where: {
      resourceId: productId,
      resourceType: "PRODUCT",
    },
  });

  return { list, totalCount };
};

/**
 * 사용자가 작성한 댓글 조회 (페이징)
 * @param userId 사용자 ID
 * @param page 페이지 번호
 * @param pageSize 페이지 크기
 * @returns 댓글 목록과 총 개수
 */
export const getCommentsByUserId = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10
): Promise<{ list: CommentWithUser[]; totalCount: number }> => {
  // 사용자 존재 여부 확인
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  });

  if (!user) {
    throw new Error("사용자를 찾을 수 없습니다.");
  }

  // 페이지네이션을 위한 건너뛰기 계산
  const skip = (page - 1) * pageSize;

  // 사용자의 댓글 목록 조회 (최신순)
  const comments = await prisma.comments.findMany({
    where: {
      userId,
      resourceType: "PRODUCT", // 상품 댓글만 필터링
    },
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  // 관련 상품 ID 목록 추출
  const productIds = [
    ...new Set(comments.map((comment) => comment.resourceId)),
  ];

  // 상품 정보 일괄 조회 (N+1 문제 방지)
  const products = await prisma.products.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
    },
  });

  // 상품 ID를 키로 하는 맵 생성
  const productMap = new Map(products.map((product) => [product.id, product]));

  // 댓글과 사용자, 상품 정보 결합
  const list = comments.map((comment) => ({
    ...comment,
    user: {
      id: user.id,
      nickname: user.nickname,
      image: user.image,
    },
    product: productMap.get(comment.resourceId) || {
      id: comment.resourceId,
      name: "알 수 없는 상품",
    },
  }));

  // 총 댓글 수 조회
  const totalCount = await prisma.comments.count({
    where: {
      userId,
      resourceType: "PRODUCT",
    },
  });

  // Omit product to match CommentWithUser interface
  const formattedList = list.map(({ product, ...rest }) => rest);

  return {
    list: formattedList,
    totalCount,
  };
};

/**
 * 특정 상품에 댓글이 있는지 확인
 * @param productId 상품 ID
 * @returns 댓글 존재 여부
 */
export const hasCommentsForProduct = async (
  productId: string
): Promise<boolean> => {
  const count = await prisma.comments.count({
    where: {
      resourceId: productId,
      resourceType: "PRODUCT",
    },
  });

  return count > 0;
};
