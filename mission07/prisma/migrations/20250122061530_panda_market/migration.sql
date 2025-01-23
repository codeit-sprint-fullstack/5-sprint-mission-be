-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "idx" SERIAL NOT NULL,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "ownerNickname" TEXT,
    "ownerId" INTEGER,
    "images" TEXT[],
    "tags" TEXT[],
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
