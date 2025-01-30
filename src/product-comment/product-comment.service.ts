import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductCommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createProductComment({ productId, content }) {
    const parsedProductid = parseInt(productId);

    return this.prisma.productComment.create({
      data: {
        productId: parsedProductid,
        content: content.content,
      },
    });
  }

  async getProductComment({ productId, cursor, limit, order }) {
    const parsedProductId = parseInt(productId);
    const parsedCursor = parseInt(cursor, 10) || undefined;
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedOrder = order === 'asc' ? 'asc' : 'desc';

    return this.prisma.productComment.findMany({
      where: { productId: parsedProductId },
      take: parsedLimit,
      cursor: parsedCursor ? { id: parsedCursor } : undefined,
      orderBy: {
        createdAt: parsedOrder,
      },
    });
  }

  async updateProductComment({ id, content }) {
    const parsedId = parseInt(id);
    return this.prisma.productComment.update({
      where: { id: parsedId },
      data: {
        content: content.content,
      },
    });
  }

  async deleteProductComment({ id }) {
    const parsedId = parseInt(id);

    return this.prisma.productComment.delete({
      where: { id: parsedId },
    });
  }
}
