-- CreateTable
CREATE TABLE "mundos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "playlists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mundoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "orderInMundo" INTEGER DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "playlists_mundoId_fkey" FOREIGN KEY ("mundoId") REFERENCES "mundos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "video_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "itemTypeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "video_items_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subtitles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "videoItemId" INTEGER NOT NULL,
    "languageCode" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'srt',
    "content" TEXT,
    "contentUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "subtitles_videoItemId_fkey" FOREIGN KEY ("videoItemId") REFERENCES "video_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "videoItemId" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "questions_videoItemId_fkey" FOREIGN KEY ("videoItemId") REFERENCES "video_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "answer_options" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "answer_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "mundos_isActive_idx" ON "mundos"("isActive");

-- CreateIndex
CREATE INDEX "mundos_createdById_idx" ON "mundos"("createdById");

-- CreateIndex
CREATE INDEX "playlists_mundoId_idx" ON "playlists"("mundoId");

-- CreateIndex
CREATE INDEX "playlists_isActive_idx" ON "playlists"("isActive");

-- CreateIndex
CREATE INDEX "playlists_createdById_idx" ON "playlists"("createdById");

-- CreateIndex
CREATE INDEX "playlists_orderInMundo_idx" ON "playlists"("orderInMundo");

-- CreateIndex
CREATE INDEX "video_items_playlistId_idx" ON "video_items"("playlistId");

-- CreateIndex
CREATE INDEX "video_items_itemTypeId_idx" ON "video_items"("itemTypeId");

-- CreateIndex
CREATE INDEX "subtitles_videoItemId_idx" ON "subtitles"("videoItemId");

-- CreateIndex
CREATE INDEX "questions_videoItemId_idx" ON "questions"("videoItemId");

-- CreateIndex
CREATE INDEX "questions_timestamp_idx" ON "questions"("timestamp");

-- CreateIndex
CREATE INDEX "answer_options_questionId_idx" ON "answer_options"("questionId");
