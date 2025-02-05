-- DropForeignKey
ALTER TABLE "ArticlesComments" DROP CONSTRAINT "ArticlesComments_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ProductsComments" DROP CONSTRAINT "ProductsComments_productId_fkey";

-- AlterTable
ALTER TABLE "Articles" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ArticlesComments" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProductsComments" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "ArticlesComments" ADD CONSTRAINT "ArticlesComments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductsComments" ADD CONSTRAINT "ProductsComments_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
