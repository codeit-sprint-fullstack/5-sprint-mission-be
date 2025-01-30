import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleCommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticleComment({ articleId, content }) {
    const parsedArticleid = parseInt(articleId);

    return this.prisma.articleComment.create({
      data: {
        articleId: parsedArticleid,
        content: content.content,
      },
    });
  }

  async getArticleComment({ articleId, cursor, limit, order }) {
    const parsedArticleId = parseInt(articleId);
    const parsedCursor = parseInt(cursor, 10) || undefined;
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedOrder = order === 'asc' ? 'asc' : 'desc';

    return this.prisma.articleComment.findMany({
      where: { articleId: parsedArticleId },
      take: parsedLimit,
      cursor: parsedCursor ? { id: parsedCursor } : undefined,
      orderBy: {
        createdAt: parsedOrder,
      },
    });
  }

  async updateArticleComment({ id, content }) {
    const parsedId = parseInt(id);
    return this.prisma.articleComment.update({
      where: { id: parsedId },
      data: {
        content: content.content,
      },
    });
  }

  async deleteArticleComment({ id }) {
    const parsedId = parseInt(id);

    return this.prisma.articleComment.delete({
      where: { id: parsedId },
    });
  }
}
