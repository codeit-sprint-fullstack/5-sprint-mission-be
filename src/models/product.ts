import { Prisma } from "@/generated/prisma";

export interface GetProductListDto {
  page: number;
  pageSize: number;
  keyword: string | undefined;
  orderBy: string | undefined;
}

export interface ProductWithTotalCount {
  products: ProductPreview[];
  totalCount: number;
}

export type ProductPreview = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    price: true;
    favoriteCount: true;
    images: true;
    owner: {
      select: {
        nickname: true;
        profileImg: true;
      };
    };
  };
}>;

export type ProductWithOwner = Prisma.ProductGetPayload<{
  include: {
    owner: {
      select: {
        nickname: true;
        profileImg: true;
      };
    };
  };
}>;

export type ProductWithOwnerAndIsFavorite = ProductWithOwner & {
  isFavorite: boolean;
};

export interface ProductPostAndPatchDto {
  ownerId: number;
  name: string;
  description: string;
  images: string[];
  tags: string[];
  price: number;
}

