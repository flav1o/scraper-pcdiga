/*
  Warnings:

  - You are about to drop the column `scraped_by` on the `Price` table. All the data in the column will be lost.
  - Added the required column `scraped_by_id` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_scraped_by_fkey";

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "scraped_by",
ADD COLUMN     "scraped_by_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_scraped_by_id_fkey" FOREIGN KEY ("scraped_by_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
