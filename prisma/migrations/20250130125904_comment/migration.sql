/*
  Warnings:

  - You are about to drop the column `articleId` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `targetId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetType` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('PRODUCT', 'ARTICLE');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_articleId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "articleId",
ADD COLUMN     "targetId" TEXT NOT NULL,
ADD COLUMN     "targetType" "TargetType" NOT NULL;
