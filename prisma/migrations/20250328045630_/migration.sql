/*
  Warnings:

  - A unique constraint covering the columns `[resourceType,resourceId]` on the table `Comments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comments_resourceType_resourceId_key" ON "Comments"("resourceType", "resourceId");
