/*
  Warnings:

  - Added the required column `resourceId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resourceType` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "resourceId" TEXT NOT NULL,
ADD COLUMN     "resourceType" TEXT NOT NULL;
