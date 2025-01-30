import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(createProductDto: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async getProductList({ cursor, limit, keyword, order }) {
    const parsedCursor = parseInt(cursor, 10) || undefined;
    const parsedLimit = parseInt(limit, 10) || 10;
    const parsedKeyword = keyword || '';
    const parsedOrder = order === 'asc' ? 'asc' : 'desc';

    const where: Prisma.ProductWhereInput = parsedKeyword
      ? {
          OR: [
            { title: { contains: parsedKeyword, mode: 'insensitive' } },
            { description: { contains: parsedKeyword, mode: 'insensitive' } },
          ],
          deletedAt: null,
        }
      : { deletedAt: null };

    return this.prisma.product.findMany({
      where,
      take: parsedLimit,
      cursor: parsedCursor ? { id: parsedCursor } : undefined,
      orderBy: {
        createdAt: parsedOrder,
      },
    });
  }

  async getProductById({ id }) {
    const parsedId = parseInt(id, 10);

    const product = await this.prisma.product.findUnique({
      where: { id: parsedId, deletedAt: null },
    });

    if (!product) {
      throw new HttpException('상품을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async updateProduct({ id, content }) {
    const parsedId = parseInt(id, 10);

    return this.prisma.product.update({
      where: { id: parsedId, deletedAt: null },
      data: content,
    });
  }

  async deleteProduct({ id }) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST); // 400 Bad Request
    }

    const existingProduct = await this.prisma.product.findUnique({
      where: { id: parsedId },
    });

    if (!existingProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND); // 404 Not Found
    }

    // 소프트 딜리트: deletedAt에 현재 시간을 기록
    return this.prisma.product.update({
      where: { id: parsedId },
      data: {
        deletedAt: new Date(), // 현재 시간으로 deletedAt 필드 설정
      },
    });
  }
}
