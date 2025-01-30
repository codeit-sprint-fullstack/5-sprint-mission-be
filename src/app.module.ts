import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { PrismaService } from './prisma/prisma.service';
import { ArticleModule } from './article/article.module';
import { ArticleCommentModule } from './article-comment/article-comment.module';
import { ProductCommentModule } from './product-comment/product-comment.module';

@Module({
  imports: [ProductModule, ArticleModule, ArticleCommentModule, ProductCommentModule],
  providers: [PrismaService],
})
export class AppModule {}
