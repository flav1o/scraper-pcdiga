-- CreateTable
CREATE TABLE "on_watch" (
    "watch_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "on_watch_pkey" PRIMARY KEY ("watch_id")
);

-- AddForeignKey
ALTER TABLE "on_watch" ADD CONSTRAINT "on_watch_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "on_watch" ADD CONSTRAINT "on_watch_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
