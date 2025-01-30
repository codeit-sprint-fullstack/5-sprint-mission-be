import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @Post()
  async createProduct(@Body() createProductDto: Prisma.ProductCreateInput) {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async getProductList(
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('order') order?: string,
  ) {
    return this.productService.getProductList({
      cursor,
      limit,
      keyword,
      order,
    });
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById({ id });
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() content: {
    title?: string,
    description?: string,
    price?: string,
    tags?: string[],
    images?: string[]
  }) {
    return this.productService.updateProduct({ id, content });
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct({ id });
  }
}
