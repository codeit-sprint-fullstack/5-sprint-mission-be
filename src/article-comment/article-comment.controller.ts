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
import { ArticleCommentService } from './article-comment.service';
import { Prisma } from '@prisma/client';

@Controller('article/comment')
export class ArticleCommentController {
  constructor(private readonly articleCommentService: ArticleCommentService) {}

  @Post(':articleId')
  async createArticleComment(
    @Param('articleId') articleId: string,
    @Body() content: string,
  ) {
    return this.articleCommentService.createArticleComment({
      articleId,
      content,
    });
  }

  @Get(':articleId')
  async getArticleComment(
    @Param('articleId') articleId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('order') order?: string,
  ) {
    return this.articleCommentService.getArticleComment({ articleId, cursor, limit, order });
  }

  @Put(':id')
  async updateArticleComment(
    @Param('id') id: string,
    @Body() content: Prisma.ArticleCommentUpdateInput,
  ) {
    return this.articleCommentService.updateArticleComment({ id, content });
  }

  @Delete(':id')
  async deleteArticleComment(@Param('id') id: string) {
    return this.articleCommentService.deleteArticleComment({ id });
  }
}
