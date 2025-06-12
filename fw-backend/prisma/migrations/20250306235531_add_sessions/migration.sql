/*
  Warnings:

  - A unique constraint covering the columns `[web_session_code]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sessions_web_session_code_key" ON "sessions"("web_session_code");
