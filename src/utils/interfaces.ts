export interface GetArticleCommentQuery {
    articleId: string;
    isDesc?: boolean;
    cursor?: string;
    takeCount?: string;
}

export interface GetProductCommentQuery {
    productId: string;
    isDesc?: boolean;
    cursor?: string;
    takeCount?: string;
}


export interface createArticleCommentService {
    articleId: string;
    content: string;
}

export interface GetArticleCommentService {
    articleId: string;
    cursor?: string;
    isDesc?: boolean;
    takeCount?: string;
}

export interface updateArticleCommentService {
    id: string;
    content: string;
}

export interface deleteArticleCommentService {
    id: string;
}


export interface createArticleServiceInterface {
    title: string;
    content: string;
}

export interface getArticleServiceInterface {
    id: string;
}

export interface updateArticleServiceInterface {
    id: string;
    title?: string;
    content?: string;
}

export interface deleteArticleServiceInterface {
    id: string;
}

export interface getArticleListServiceInterface {
    page?: number;
    pageSize?: number;
}


export interface createCommentServiceInterface {
    productId: string;
    content: string;
}

export interface getCommentServiceInterface {
    productId: string;
    cursor?: string;
    isDesc?: boolean;
    takeCount?: string;
}

export interface updateCommentServiceInterface {
    id: string;
    content: string;
}

export interface deleteCommentServiceInterface {
    id: string;
}


export interface createProductServiceInterface {
    title: string;
    description: string;
    price: number;
    tags?: string[];
}

export interface getProductServiceInterface {
    id: string;
}

export interface getProductListServiceInterface {
    page: string | undefined ;
    pageSize: string | undefined ;
    order: string | undefined ;
}

export interface updateProductServiceInterface {
    id: string;
    title: string;
    description: string;
    price: number;
    tags?: string[];
}

export interface deleteProductServiceInterface {
    id: string;
}