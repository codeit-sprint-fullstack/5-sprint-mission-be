/*
  Warnings:

  - You are about to drop the column `likeCnt` on the `Articles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "likeCnt",
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;
