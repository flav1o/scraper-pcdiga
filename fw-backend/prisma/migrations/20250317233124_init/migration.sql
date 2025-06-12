/*
  Warnings:

  - A unique constraint covering the columns `[user_id,product_id]` on the table `on_watch` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "on_watch_user_id_product_id_key" ON "on_watch"("user_id", "product_id");
