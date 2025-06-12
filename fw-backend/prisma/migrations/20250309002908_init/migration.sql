-- CreateEnum
CREATE TYPE "Store" AS ENUM ('PC_DIGA');

-- AlterTable
ALTER TABLE "prices" ADD COLUMN     "store" "Store" NOT NULL DEFAULT 'PC_DIGA';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "url" TEXT NOT NULL DEFAULT 'https://www.pcdiga.com';
