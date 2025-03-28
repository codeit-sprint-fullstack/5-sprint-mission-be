/*
  Warnings:

  - Added the required column `nickname` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Made the column `authorId` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "nickname" TEXT NOT NULL,
ALTER COLUMN "authorId" SET NOT NULL;
