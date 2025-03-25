export interface ArticleWriter {
  id: string,
  nickname: string,
}

export interface ArticleRequest {
  title: string,
  content: string,
  image: string,
}

export interface ArticleResponse {
  id: string,
  title: string,
  content: string,
  image: string,
  writer: ArticleWriter,
  likeCount: number,
  isLiked?: boolean,
  createdAt: Date,
  updatedAt: Date,
}

export interface ArticleListResponse {
  totalCount: number,
  list: ArticleResponse[],
}