/*
  Warnings:

  - Added the required column `articleId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Article_nickname_key";

-- DropIndex
DROP INDEX "Comment_userId_key";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "articleId" TEXT NOT NULL,
ALTER COLUMN "userId" DROP DEFAULT;
