export interface CommentRequest {
  content: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  writer: {
    id: string;
    nickname: string;
    image: string;
  };
}

export interface CommentListResponse {
  list: CommentResponse[];
}
