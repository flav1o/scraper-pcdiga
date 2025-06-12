/*
  Warnings:

  - The primary key for the `Price` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `price_id` on the `Price` table. All the data in the column will be lost.
  - The required column `priceId` was added to the `Price` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Price" DROP CONSTRAINT "Price_pkey",
DROP COLUMN "price_id",
ADD COLUMN     "priceId" TEXT NOT NULL,
ADD CONSTRAINT "Price_pkey" PRIMARY KEY ("priceId");
