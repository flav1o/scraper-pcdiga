/*
  Warnings:

  - Added the required column `scraped_by` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Price" ADD COLUMN     "scraped_by" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_scraped_by_fkey" FOREIGN KEY ("scraped_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
