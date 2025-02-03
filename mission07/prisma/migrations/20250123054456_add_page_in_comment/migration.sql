-- CreateEnum
CREATE TYPE "Page" AS ENUM ('Product', 'Board');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "page" "Page" NOT NULL DEFAULT 'Product';
