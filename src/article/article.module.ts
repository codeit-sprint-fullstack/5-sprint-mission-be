import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, PrismaService]
})
export class ArticleModule {}
