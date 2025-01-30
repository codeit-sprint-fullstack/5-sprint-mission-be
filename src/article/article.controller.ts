import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async createArticle(@Body() createArticleDto: Prisma.ArticleCreateInput) {
    return this.articleService.createArticle(createArticleDto);
  }

  @Get()
  async getArticleList(
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('keyword') keyword?: string,
    @Query('order') order?: string,
  ) {
    return this.articleService.getArticleList({
      cursor,
      limit,
      keyword,
      order,
    });
  }

  @Get(':id')
  async getArticleById(@Param('id') id: string) {
    return this.articleService.getArticleById({ id });
  }

  @Put(':id')
  async updateArticle(
    @Param('id') id: string,
    @Body() content: { title?: string; content?: string },
  ) {
    return this.articleService.updateArticle({ id, content });
  }

  @Delete(':id')
  async deleteArticle(@Param('id') id: string) {
    return this.articleService.deleteArticle({ id });
  }
}
