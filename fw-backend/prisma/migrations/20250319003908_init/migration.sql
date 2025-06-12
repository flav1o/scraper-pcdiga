/*
  Warnings:

  - A unique constraint covering the columns `[product_id,user_id]` on the table `on_watch` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "on_watch_user_id_product_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "on_watch_product_id_user_id_key" ON "on_watch"("product_id", "user_id");
