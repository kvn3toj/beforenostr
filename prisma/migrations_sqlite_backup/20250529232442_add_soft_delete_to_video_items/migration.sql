-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_video_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "itemTypeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "duration" INTEGER,
    CONSTRAINT "video_items_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_video_items" ("content", "createdAt", "description", "duration", "id", "isActive", "itemTypeId", "order", "playlistId", "title", "updatedAt") SELECT "content", "createdAt", "description", "duration", "id", "isActive", "itemTypeId", "order", "playlistId", "title", "updatedAt" FROM "video_items";
DROP TABLE "video_items";
ALTER TABLE "new_video_items" RENAME TO "video_items";
CREATE INDEX "video_items_playlistId_idx" ON "video_items"("playlistId");
CREATE INDEX "video_items_itemTypeId_idx" ON "video_items"("itemTypeId");
CREATE INDEX "video_items_isDeleted_idx" ON "video_items"("isDeleted");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
