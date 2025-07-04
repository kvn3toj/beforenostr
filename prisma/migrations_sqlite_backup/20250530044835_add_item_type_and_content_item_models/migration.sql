-- CreateTable
CREATE TABLE "item_types" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "content_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    CONSTRAINT "content_items_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "content_items_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "item_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "item_types_name_key" ON "item_types"("name");

-- CreateIndex
CREATE INDEX "item_types_isActive_idx" ON "item_types"("isActive");

-- CreateIndex
CREATE INDEX "item_types_isDeleted_idx" ON "item_types"("isDeleted");

-- CreateIndex
CREATE INDEX "content_items_playlistId_idx" ON "content_items"("playlistId");

-- CreateIndex
CREATE INDEX "content_items_itemTypeId_idx" ON "content_items"("itemTypeId");

-- CreateIndex
CREATE INDEX "content_items_isDeleted_idx" ON "content_items"("isDeleted");
