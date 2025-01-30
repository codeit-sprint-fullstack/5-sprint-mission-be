import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}

  async createArticle(createArticleDto: Prisma.ArticleCreateInput) {
    return this.prisma.article.create({
      data: createArticleDto,
    });
  }

  async getArticleList({ cursor, limit, keyword, order }) {
    const parsedCursor = parseInt(cursor, 10) || undefined;
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedKeyword = keyword || '';
    const parsedOrder = order === 'asc' ? 'asc' : 'desc';

    const where: Prisma.ArticleWhereInput = parsedKeyword
      ? {
          OR: [
            { title: { contains: parsedKeyword, mode: 'insensitive' } },
            { content: { contains: parsedKeyword, mode: 'insensitive' } },
          ],
          deletedAt: null,
        }
      : { deletedAt: null };

    return this.prisma.article.findMany({
      where,
      take: parsedLimit,
      cursor: parsedCursor ? { id: parsedCursor } : undefined,
      orderBy: {
        createdAt: parsedOrder,
      },
    });
  }

  async getArticleById({ id }) {
    return this.prisma.article.findUnique({
      where: { id: parseInt(id) },
    })
  }

  async updateArticle({ id, content }) {
    return this.prisma.article.update({
      where: { id: parseInt(id) },
      data: content
    })
  }

  async deleteArticle({ id }) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST); // 400 Bad Request
    }

    const existingArticle = await this.prisma.article.findUnique({
      where: { id: parsedId },
    });

    if (!existingArticle) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND); // 404 Not Found
    }

    // 소프트 딜리트: deletedAt에 현재 시간을 기록
    return this.prisma.article.update({
      where: { id: parsedId },
      data: {
        deletedAt: new Date(), // 현재 시간으로 deletedAt 필드 설정
      },
    });
  }
}
