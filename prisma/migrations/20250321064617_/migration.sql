/*
  Warnings:

  - A unique constraint covering the columns `[userId,resourceType,resourceId]` on the table `Favorites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favorites_userId_resourceType_resourceId_key" ON "Favorites"("userId", "resourceType", "resourceId");
