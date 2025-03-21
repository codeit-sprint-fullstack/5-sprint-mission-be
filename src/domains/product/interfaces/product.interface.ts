export interface ProductRequest {
  name: string,
  description: string,
  price: number,
  images: string[],
  tags: string[],
}

export interface ProductResponse {
  id: string,
  name: string,
  description: string,
  price: number,
  images: string[],
  tags: string[],
  ownerId: string,
  ownerNickname: string,
  favoriteCount: number,
  createdAt: Date,
  isFavorite?: boolean,
}

export interface ProductListResponse {
  totalCount: number,
  list: ProductResponse[],
}