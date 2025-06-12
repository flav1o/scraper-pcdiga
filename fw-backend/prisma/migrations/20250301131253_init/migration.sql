/*
  Warnings:

  - A unique constraint covering the columns `[ean]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_ean_key" ON "Product"("ean");
