-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "LikeArticle" ADD CONSTRAINT "LikeArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
