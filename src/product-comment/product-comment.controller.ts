import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProductCommentService } from './product-comment.service';
import { Prisma } from '@prisma/client';

@Controller('product/comment')
export class ProductCommentController {
  constructor(private readonly productCommentService: ProductCommentService) {}

  @Post(':productId')
  async createProductComment(
    @Param('productId') productId: string,
    @Body() content: string,
  ) {
    return this.productCommentService.createProductComment({
      productId,
      content,
    });
  }

  @Get(':productId')
  async getProductComment(
    @Param('productId') productId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('order') order?: string,
  ) {
    return this.productCommentService.getProductComment({ productId, cursor, limit, order });
  }

  @Put(':id')
  async updateProductComment(
    @Param('id') id: string,
    @Body() content: Prisma.ProductCommentUpdateInput,
  ) {
    return this.productCommentService.updateProductComment({ id, content });
  }

  @Delete(':id')
  async deleteProductComment(@Param('id') id: string) {
    return this.productCommentService.deleteProductComment({ id });
  }
}
