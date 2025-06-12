/*
  Warnings:

  - You are about to drop the column `web_session_code` on the `sessions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "sessions_web_session_code_key";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "web_session_code";
