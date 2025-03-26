/*
  Warnings:

  - Changed the type of `price` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "favoritesCount" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "price",
ADD COLUMN     "price" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LikeProduct" ADD CONSTRAINT "LikeProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
