-- AlterTable
ALTER TABLE "video_items" ADD COLUMN "categories" TEXT;
ALTER TABLE "video_items" ADD COLUMN "language" TEXT;
ALTER TABLE "video_items" ADD COLUMN "quality" TEXT;
ALTER TABLE "video_items" ADD COLUMN "tags" TEXT;
ALTER TABLE "video_items" ADD COLUMN "thumbnailUrl" TEXT;

-- CreateIndex
CREATE INDEX "video_items_language_idx" ON "video_items"("language");
