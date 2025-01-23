/*
  Warnings:

  - A unique constraint covering the columns `[tag]` on the table `ProductsTags` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductsTags_tag_key" ON "ProductsTags"("tag");
