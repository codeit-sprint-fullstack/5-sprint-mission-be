/*
  Warnings:

  - You are about to drop the `LikesArticle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LikesProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LikesArticle" DROP CONSTRAINT "LikesArticle_articleId_fkey";

-- DropForeignKey
ALTER TABLE "LikesArticle" DROP CONSTRAINT "LikesArticle_userId_fkey";

-- DropForeignKey
ALTER TABLE "LikesProduct" DROP CONSTRAINT "LikesProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "LikesProduct" DROP CONSTRAINT "LikesProduct_userId_fkey";

-- DropTable
DROP TABLE "LikesArticle";

-- DropTable
DROP TABLE "LikesProduct";

-- CreateTable
CREATE TABLE "articleLikes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "articleLikes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productLikes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "productLikes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "articleLikes" ADD CONSTRAINT "articleLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articleLikes" ADD CONSTRAINT "articleLikes_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productLikes" ADD CONSTRAINT "productLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productLikes" ADD CONSTRAINT "productLikes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
