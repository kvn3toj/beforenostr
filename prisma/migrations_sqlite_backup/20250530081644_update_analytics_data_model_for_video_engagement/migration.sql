-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_analytics_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "videoItemId" TEXT,
    "playlistId" TEXT,
    "mundoId" TEXT,
    "sessionId" TEXT,
    "eventData" TEXT,
    "metadata" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_analytics_data" ("eventData", "eventType", "id", "timestamp", "userId") SELECT "eventData", "eventType", "id", "timestamp", "userId" FROM "analytics_data";
DROP TABLE "analytics_data";
ALTER TABLE "new_analytics_data" RENAME TO "analytics_data";
CREATE INDEX "analytics_data_userId_idx" ON "analytics_data"("userId");
CREATE INDEX "analytics_data_eventType_idx" ON "analytics_data"("eventType");
CREATE INDEX "analytics_data_videoItemId_idx" ON "analytics_data"("videoItemId");
CREATE INDEX "analytics_data_playlistId_idx" ON "analytics_data"("playlistId");
CREATE INDEX "analytics_data_sessionId_idx" ON "analytics_data"("sessionId");
CREATE INDEX "analytics_data_timestamp_idx" ON "analytics_data"("timestamp");
CREATE INDEX "analytics_data_createdAt_idx" ON "analytics_data"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
