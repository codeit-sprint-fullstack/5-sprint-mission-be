/*
  Warnings:

  - A unique constraint covering the columns `[resourceType,resourceId,userId]` on the table `Comments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Comments_resourceType_resourceId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Comments_resourceType_resourceId_userId_key" ON "Comments"("resourceType", "resourceId", "userId");
