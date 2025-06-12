/*
  Warnings:

  - Added the required column `checksum` to the `prices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prices" ADD COLUMN     "checksum" TEXT NOT NULL;
