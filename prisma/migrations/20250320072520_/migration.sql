/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Auths` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Auths" ALTER COLUMN "refreshToken" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Auths_userId_key" ON "Auths"("userId");
