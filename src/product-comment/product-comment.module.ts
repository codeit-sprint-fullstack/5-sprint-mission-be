import { Module } from '@nestjs/common';
import { ProductCommentService } from './product-comment.service';
import { ProductCommentController } from './product-comment.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ProductCommentService, PrismaService],
  controllers: [ProductCommentController]
})
export class ProductCommentModule {}
