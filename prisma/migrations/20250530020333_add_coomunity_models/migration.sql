-- CreateTable
CREATE TABLE "worlds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "mundoId" TEXT,
    CONSTRAINT "worlds_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "worlds_mundoId_fkey" FOREIGN KEY ("mundoId") REFERENCES "mundos" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "stages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "worldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "stages_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "worlds" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "gamificationFramework" TEXT DEFAULT 'Octalysis',
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "experiences_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stages" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "experiences_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "experienceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "multimediaType" TEXT,
    "contentUrl" TEXT,
    "duration" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "videoItemId" INTEGER,
    CONSTRAINT "activities_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "activities_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "activities_videoItemId_fkey" FOREIGN KEY ("videoItemId") REFERENCES "video_items" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gamified_playlists" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT,
    "playlistId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sequenceType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "gamified_playlists_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "gamified_playlists_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "activityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" TEXT,
    "correctAnswer" TEXT,
    "ondasList" TEXT,
    "displayTimeSeconds" INTEGER,
    "optionalDisplaySeconds" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_questions_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_answers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questionId" INTEGER,
    "activityQuestionId" TEXT,
    "answerGiven" TEXT NOT NULL,
    "isCorrect" BOOLEAN,
    "ondasEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "user_answers_activityQuestionId_fkey" FOREIGN KEY ("activityQuestionId") REFERENCES "activity_questions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "caducityDate" DATETIME,
    "source" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "merits" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "relatedEntityId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "merits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "blockchainAddress" TEXT,
    "balanceUnits" REAL NOT NULL DEFAULT 0,
    "balanceToins" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromUserId" TEXT,
    "toUserId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "tokenType" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "transactions_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "wallets" ("userId") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "wallets" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "groups_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_groups" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "roleInGroup" TEXT NOT NULL DEFAULT 'MEMBER',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "groupId"),
    CONSTRAINT "user_groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_groups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "publications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "publications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "publicationId" TEXT,
    "activityId" TEXT,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comments_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invitation_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "invitation_templates_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gift_cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inviterId" TEXT NOT NULL,
    "invitedName" TEXT NOT NULL,
    "invitedEmail" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "unitsAmount" REAL NOT NULL,
    "suggestions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "gift_cards_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_invitations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "giftCardId" TEXT NOT NULL,
    "invitedUserId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_invitations_giftCardId_fkey" FOREIGN KEY ("giftCardId") REFERENCES "gift_cards" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_invitations_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parameters" TEXT,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "reports_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "configurations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT
);

-- CreateTable
CREATE TABLE "analytics_data" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventData" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "rankings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "personalities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "traits" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ui_component_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "templateJson" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ui_component_templates_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "documentType" TEXT,
    "documentNumber" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "address" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "topUserCount" INTEGER NOT NULL DEFAULT 0,
    "personalityId" TEXT,
    CONSTRAINT "users_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "personalities" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("avatarUrl", "createdAt", "email", "id", "isActive", "name", "password", "updatedAt") SELECT "avatarUrl", "createdAt", "email", "id", "isActive", "name", "password", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE INDEX "users_email_idx" ON "users"("email");
CREATE INDEX "users_isActive_idx" ON "users"("isActive");
CREATE INDEX "users_username_idx" ON "users"("username");
CREATE INDEX "users_status_idx" ON "users"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "worlds_creatorId_idx" ON "worlds"("creatorId");

-- CreateIndex
CREATE INDEX "worlds_status_idx" ON "worlds"("status");

-- CreateIndex
CREATE INDEX "worlds_mundoId_idx" ON "worlds"("mundoId");

-- CreateIndex
CREATE INDEX "stages_worldId_idx" ON "stages"("worldId");

-- CreateIndex
CREATE INDEX "stages_order_idx" ON "stages"("order");

-- CreateIndex
CREATE INDEX "experiences_stageId_idx" ON "experiences"("stageId");

-- CreateIndex
CREATE INDEX "experiences_creatorId_idx" ON "experiences"("creatorId");

-- CreateIndex
CREATE INDEX "activities_experienceId_idx" ON "activities"("experienceId");

-- CreateIndex
CREATE INDEX "activities_creatorId_idx" ON "activities"("creatorId");

-- CreateIndex
CREATE INDEX "activities_order_idx" ON "activities"("order");

-- CreateIndex
CREATE INDEX "activities_status_idx" ON "activities"("status");

-- CreateIndex
CREATE INDEX "activities_videoItemId_idx" ON "activities"("videoItemId");

-- CreateIndex
CREATE INDEX "gamified_playlists_activityId_idx" ON "gamified_playlists"("activityId");

-- CreateIndex
CREATE INDEX "gamified_playlists_playlistId_idx" ON "gamified_playlists"("playlistId");

-- CreateIndex
CREATE INDEX "gamified_playlists_status_idx" ON "gamified_playlists"("status");

-- CreateIndex
CREATE INDEX "activity_questions_activityId_idx" ON "activity_questions"("activityId");

-- CreateIndex
CREATE INDEX "user_answers_userId_idx" ON "user_answers"("userId");

-- CreateIndex
CREATE INDEX "user_answers_questionId_idx" ON "user_answers"("questionId");

-- CreateIndex
CREATE INDEX "user_answers_activityQuestionId_idx" ON "user_answers"("activityQuestionId");

-- CreateIndex
CREATE INDEX "tokens_userId_idx" ON "tokens"("userId");

-- CreateIndex
CREATE INDEX "tokens_type_idx" ON "tokens"("type");

-- CreateIndex
CREATE INDEX "tokens_status_idx" ON "tokens"("status");

-- CreateIndex
CREATE INDEX "tokens_caducityDate_idx" ON "tokens"("caducityDate");

-- CreateIndex
CREATE INDEX "merits_userId_idx" ON "merits"("userId");

-- CreateIndex
CREATE INDEX "merits_type_idx" ON "merits"("type");

-- CreateIndex
CREATE INDEX "merits_source_idx" ON "merits"("source");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_key" ON "wallets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_blockchainAddress_key" ON "wallets"("blockchainAddress");

-- CreateIndex
CREATE INDEX "wallets_userId_idx" ON "wallets"("userId");

-- CreateIndex
CREATE INDEX "wallets_blockchainAddress_idx" ON "wallets"("blockchainAddress");

-- CreateIndex
CREATE INDEX "wallets_status_idx" ON "wallets"("status");

-- CreateIndex
CREATE INDEX "transactions_fromUserId_idx" ON "transactions"("fromUserId");

-- CreateIndex
CREATE INDEX "transactions_toUserId_idx" ON "transactions"("toUserId");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "groups_ownerId_idx" ON "groups"("ownerId");

-- CreateIndex
CREATE INDEX "groups_type_idx" ON "groups"("type");

-- CreateIndex
CREATE INDEX "user_groups_userId_idx" ON "user_groups"("userId");

-- CreateIndex
CREATE INDEX "user_groups_groupId_idx" ON "user_groups"("groupId");

-- CreateIndex
CREATE INDEX "publications_userId_idx" ON "publications"("userId");

-- CreateIndex
CREATE INDEX "publications_type_idx" ON "publications"("type");

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- CreateIndex
CREATE INDEX "comments_publicationId_idx" ON "comments"("publicationId");

-- CreateIndex
CREATE INDEX "comments_activityId_idx" ON "comments"("activityId");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_read_idx" ON "notifications"("read");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "invitation_templates_creatorId_idx" ON "invitation_templates"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "gift_cards_token_key" ON "gift_cards"("token");

-- CreateIndex
CREATE INDEX "gift_cards_inviterId_idx" ON "gift_cards"("inviterId");

-- CreateIndex
CREATE INDEX "gift_cards_token_idx" ON "gift_cards"("token");

-- CreateIndex
CREATE INDEX "gift_cards_status_idx" ON "gift_cards"("status");

-- CreateIndex
CREATE INDEX "user_invitations_giftCardId_idx" ON "user_invitations"("giftCardId");

-- CreateIndex
CREATE INDEX "user_invitations_invitedUserId_idx" ON "user_invitations"("invitedUserId");

-- CreateIndex
CREATE INDEX "user_invitations_status_idx" ON "user_invitations"("status");

-- CreateIndex
CREATE INDEX "reports_creatorId_idx" ON "reports"("creatorId");

-- CreateIndex
CREATE INDEX "reports_type_idx" ON "reports"("type");

-- CreateIndex
CREATE UNIQUE INDEX "configurations_key_key" ON "configurations"("key");

-- CreateIndex
CREATE INDEX "configurations_type_idx" ON "configurations"("type");

-- CreateIndex
CREATE INDEX "logs_level_idx" ON "logs"("level");

-- CreateIndex
CREATE INDEX "logs_timestamp_idx" ON "logs"("timestamp");

-- CreateIndex
CREATE INDEX "analytics_data_userId_idx" ON "analytics_data"("userId");

-- CreateIndex
CREATE INDEX "analytics_data_eventType_idx" ON "analytics_data"("eventType");

-- CreateIndex
CREATE INDEX "analytics_data_timestamp_idx" ON "analytics_data"("timestamp");

-- CreateIndex
CREATE INDEX "rankings_type_idx" ON "rankings"("type");

-- CreateIndex
CREATE INDEX "rankings_period_idx" ON "rankings"("period");

-- CreateIndex
CREATE UNIQUE INDEX "personalities_name_key" ON "personalities"("name");

-- CreateIndex
CREATE INDEX "ui_component_templates_creatorId_idx" ON "ui_component_templates"("creatorId");

-- CreateIndex
CREATE INDEX "ui_component_templates_type_idx" ON "ui_component_templates"("type");
