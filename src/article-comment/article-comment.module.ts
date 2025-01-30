import { Module } from '@nestjs/common';
import { ArticleCommentController } from './article-comment.controller';
import { ArticleCommentService } from './article-comment.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ArticleCommentController],
  providers: [ArticleCommentService, PrismaService]
})
export class ArticleCommentModule {}
