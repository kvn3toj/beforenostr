-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('LUKAS', 'USD', 'EUR', 'BTC', 'ETH');

-- CreateEnum
CREATE TYPE "MarketplaceItemType" AS ENUM ('PRODUCT', 'SERVICE', 'EXPERIENCE', 'SKILL_EXCHANGE', 'DIGITAL_CONTENT');

-- CreateEnum
CREATE TYPE "MarketplaceItemStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'SOLD', 'EXPIRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "StudyRoomStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('BUG', 'IMPROVEMENT', 'MISSING_FEATURE', 'PERFORMANCE', 'UX_ISSUE', 'CODE_ANALYSIS');

-- CreateEnum
CREATE TYPE "FeedbackPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('SUBMITTED', 'REVIEWING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "mundos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "mundos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlists" (
    "id" TEXT NOT NULL,
    "mundoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "orderInMundo" INTEGER DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_items" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "url" TEXT,
    "platform" TEXT NOT NULL DEFAULT 'youtube',
    "externalId" TEXT,
    "playlistId" TEXT NOT NULL,
    "itemTypeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "categories" TEXT,
    "language" TEXT,
    "quality" TEXT,
    "tags" TEXT,
    "thumbnailUrl" TEXT,

    CONSTRAINT "video_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subtitles" (
    "id" SERIAL NOT NULL,
    "videoItemId" INTEGER NOT NULL,
    "languageCode" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'srt',
    "content" TEXT,
    "contentUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subtitles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,
    "videoItemId" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endTimestamp" INTEGER,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_options" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
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
    "temp_field" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_permissions" (
    "id" TEXT NOT NULL,
    "videoItemId" INTEGER NOT NULL,
    "showWaveCount" BOOLEAN NOT NULL DEFAULT true,
    "showVideos" BOOLEAN NOT NULL DEFAULT true,
    "showVideoSubtitles" BOOLEAN NOT NULL DEFAULT true,
    "showComments" BOOLEAN NOT NULL DEFAULT true,
    "showPublishDate" BOOLEAN NOT NULL DEFAULT true,
    "showVideoDuration" BOOLEAN NOT NULL DEFAULT true,
    "showLikeButton" BOOLEAN NOT NULL DEFAULT true,
    "allowRewindForward" BOOLEAN NOT NULL DEFAULT false,
    "allowViewComments" BOOLEAN NOT NULL DEFAULT true,
    "allowMakeComments" BOOLEAN NOT NULL DEFAULT true,
    "showLikeComments" BOOLEAN NOT NULL DEFAULT true,
    "sortCommentsByAffinity" BOOLEAN NOT NULL DEFAULT false,
    "showCommenterName" BOOLEAN NOT NULL DEFAULT false,
    "playlistPosition" TEXT NOT NULL DEFAULT 'position1',
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "video_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedById" TEXT,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "worlds" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mundoId" TEXT,

    CONSTRAINT "worlds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stages" (
    "id" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "gamificationFramework" TEXT DEFAULT 'Octalysis',
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "videoItemId" INTEGER,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gamified_playlists" (
    "id" TEXT NOT NULL,
    "activityId" TEXT,
    "playlistId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sequenceType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gamified_playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_questions" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "questionText" TEXT NOT NULL,
    "options" TEXT,
    "correctAnswer" TEXT,
    "ondasList" TEXT,
    "displayTimeSeconds" INTEGER,
    "optionalDisplaySeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_answers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" INTEGER,
    "activityQuestionId" TEXT,
    "answerGiven" TEXT NOT NULL,
    "isCorrect" BOOLEAN,
    "ondasEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "caducityDate" TIMESTAMP(3),
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merits" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "relatedEntityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "merits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "blockchainAddress" TEXT,
    "balanceUnits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balanceToins" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "fromUserId" TEXT,
    "toUserId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "tokenType" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_groups" (
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "roleInGroup" TEXT NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_groups_pkey" PRIMARY KEY ("userId","groupId")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicationId" TEXT,
    "activityId" TEXT,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invitation_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_cards" (
    "id" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,
    "invitedName" TEXT NOT NULL,
    "invitedEmail" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "unitsAmount" DOUBLE PRECISION NOT NULL,
    "suggestions" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gift_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_invitations" (
    "id" TEXT NOT NULL,
    "giftCardId" TEXT NOT NULL,
    "invitedUserId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "parameters" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configurations" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" TEXT,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analytics_data" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventType" TEXT NOT NULL,
    "videoItemId" TEXT,
    "playlistId" TEXT,
    "mundoId" TEXT,
    "sessionId" TEXT,
    "eventData" TEXT,
    "metadata" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rankings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rankings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personalities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "traits" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ui_component_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "templateJson" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ui_component_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "itemTypeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "config" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_rewards" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "description" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_challenges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "metadata" TEXT,

    CONSTRAINT "user_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fullDescription" TEXT,
    "itemType" "MarketplaceItemType" NOT NULL DEFAULT 'SERVICE',
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "priceToins" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'LUKAS',
    "category" TEXT,
    "tags" TEXT[],
    "images" TEXT[],
    "stock" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "status" "MarketplaceItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "sellerId" TEXT NOT NULL,
    "metadata" TEXT,

    CONSTRAINT "marketplace_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "videoId" INTEGER NOT NULL,
    "hostId" TEXT NOT NULL,
    "maxParticipants" INTEGER NOT NULL DEFAULT 10,
    "status" "StudyRoomStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPaused" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_room_participants" (
    "id" TEXT NOT NULL,
    "studyRoomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isHost" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "study_room_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_room_messages" (
    "id" TEXT NOT NULL,
    "studyRoomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'CHAT',
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "study_room_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_reports" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "FeedbackPriority" NOT NULL DEFAULT 'MEDIUM',
    "category" TEXT NOT NULL,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'SUBMITTED',
    "elementContext" JSONB NOT NULL,
    "technicalContext" JSONB NOT NULL,
    "codeAnalysis" JSONB,
    "aiSuggestions" JSONB,
    "adminResponse" TEXT,
    "adminUserId" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "duplicateOf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "website" TEXT,
    "skills" TEXT[],
    "interests" TEXT[],
    "isEmprendedorConfiable" BOOLEAN NOT NULL DEFAULT false,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "marketplaceItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "communication" INTEGER,
    "quality" INTEGER,
    "delivery" INTEGER,
    "value" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_matches" (
    "id" TEXT NOT NULL,
    "marketplaceItemId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "sellerConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_messages" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_messages_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "video_items_isDeleted_idx" ON "video_items"("isDeleted");

-- CreateIndex
CREATE INDEX "video_items_platform_idx" ON "video_items"("platform");

-- CreateIndex
CREATE INDEX "video_items_externalId_idx" ON "video_items"("externalId");

-- CreateIndex
CREATE INDEX "video_items_language_idx" ON "video_items"("language");

-- CreateIndex
CREATE INDEX "subtitles_videoItemId_idx" ON "subtitles"("videoItemId");

-- CreateIndex
CREATE INDEX "questions_videoItemId_idx" ON "questions"("videoItemId");

-- CreateIndex
CREATE INDEX "questions_timestamp_idx" ON "questions"("timestamp");

-- CreateIndex
CREATE INDEX "questions_endTimestamp_idx" ON "questions"("endTimestamp");

-- CreateIndex
CREATE INDEX "answer_options_questionId_idx" ON "answer_options"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE INDEX "user_roles_userId_idx" ON "user_roles"("userId");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE INDEX "user_roles_assignedById_idx" ON "user_roles"("assignedById");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "video_permissions_videoItemId_key" ON "video_permissions"("videoItemId");

-- CreateIndex
CREATE INDEX "video_permissions_videoItemId_idx" ON "video_permissions"("videoItemId");

-- CreateIndex
CREATE INDEX "video_permissions_isDraft_idx" ON "video_permissions"("isDraft");

-- CreateIndex
CREATE INDEX "video_permissions_createdById_idx" ON "video_permissions"("createdById");

-- CreateIndex
CREATE INDEX "role_permissions_roleId_idx" ON "role_permissions"("roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE INDEX "role_permissions_assignedById_idx" ON "role_permissions"("assignedById");

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
CREATE INDEX "likes_userId_idx" ON "likes"("userId");

-- CreateIndex
CREATE INDEX "likes_publicationId_idx" ON "likes"("publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_publicationId_key" ON "likes"("userId", "publicationId");

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
CREATE INDEX "analytics_data_videoItemId_idx" ON "analytics_data"("videoItemId");

-- CreateIndex
CREATE INDEX "analytics_data_playlistId_idx" ON "analytics_data"("playlistId");

-- CreateIndex
CREATE INDEX "analytics_data_sessionId_idx" ON "analytics_data"("sessionId");

-- CreateIndex
CREATE INDEX "analytics_data_timestamp_idx" ON "analytics_data"("timestamp");

-- CreateIndex
CREATE INDEX "analytics_data_createdAt_idx" ON "analytics_data"("createdAt");

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

-- CreateIndex
CREATE INDEX "challenges_status_idx" ON "challenges"("status");

-- CreateIndex
CREATE INDEX "challenges_type_idx" ON "challenges"("type");

-- CreateIndex
CREATE INDEX "challenges_startDate_idx" ON "challenges"("startDate");

-- CreateIndex
CREATE INDEX "challenges_endDate_idx" ON "challenges"("endDate");

-- CreateIndex
CREATE INDEX "challenge_rewards_challengeId_idx" ON "challenge_rewards"("challengeId");

-- CreateIndex
CREATE INDEX "challenge_rewards_type_idx" ON "challenge_rewards"("type");

-- CreateIndex
CREATE INDEX "user_challenges_userId_idx" ON "user_challenges"("userId");

-- CreateIndex
CREATE INDEX "user_challenges_challengeId_idx" ON "user_challenges"("challengeId");

-- CreateIndex
CREATE INDEX "user_challenges_status_idx" ON "user_challenges"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_challenges_userId_challengeId_key" ON "user_challenges"("userId", "challengeId");

-- CreateIndex
CREATE INDEX "marketplace_items_sellerId_idx" ON "marketplace_items"("sellerId");

-- CreateIndex
CREATE INDEX "marketplace_items_status_idx" ON "marketplace_items"("status");

-- CreateIndex
CREATE INDEX "marketplace_items_isActive_idx" ON "marketplace_items"("isActive");

-- CreateIndex
CREATE INDEX "marketplace_items_isDeleted_idx" ON "marketplace_items"("isDeleted");

-- CreateIndex
CREATE INDEX "marketplace_items_createdAt_idx" ON "marketplace_items"("createdAt");

-- CreateIndex
CREATE INDEX "marketplace_items_updatedAt_idx" ON "marketplace_items"("updatedAt");

-- CreateIndex
CREATE INDEX "marketplace_items_viewCount_idx" ON "marketplace_items"("viewCount");

-- CreateIndex
CREATE INDEX "marketplace_items_favoriteCount_idx" ON "marketplace_items"("favoriteCount");

-- CreateIndex
CREATE INDEX "marketplace_items_itemType_idx" ON "marketplace_items"("itemType");

-- CreateIndex
CREATE INDEX "marketplace_items_price_idx" ON "marketplace_items"("price");

-- CreateIndex
CREATE INDEX "marketplace_items_priceToins_idx" ON "marketplace_items"("priceToins");

-- CreateIndex
CREATE INDEX "marketplace_items_currency_idx" ON "marketplace_items"("currency");

-- CreateIndex
CREATE INDEX "marketplace_items_category_idx" ON "marketplace_items"("category");

-- CreateIndex
CREATE INDEX "marketplace_items_location_idx" ON "marketplace_items"("location");

-- CreateIndex
CREATE INDEX "study_rooms_hostId_idx" ON "study_rooms"("hostId");

-- CreateIndex
CREATE INDEX "study_rooms_videoId_idx" ON "study_rooms"("videoId");

-- CreateIndex
CREATE INDEX "study_rooms_status_idx" ON "study_rooms"("status");

-- CreateIndex
CREATE INDEX "study_rooms_isActive_idx" ON "study_rooms"("isActive");

-- CreateIndex
CREATE INDEX "study_rooms_createdAt_idx" ON "study_rooms"("createdAt");

-- CreateIndex
CREATE INDEX "study_room_participants_studyRoomId_idx" ON "study_room_participants"("studyRoomId");

-- CreateIndex
CREATE INDEX "study_room_participants_userId_idx" ON "study_room_participants"("userId");

-- CreateIndex
CREATE INDEX "study_room_participants_isActive_idx" ON "study_room_participants"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "study_room_participants_studyRoomId_userId_key" ON "study_room_participants"("studyRoomId", "userId");

-- CreateIndex
CREATE INDEX "study_room_messages_studyRoomId_idx" ON "study_room_messages"("studyRoomId");

-- CreateIndex
CREATE INDEX "study_room_messages_userId_idx" ON "study_room_messages"("userId");

-- CreateIndex
CREATE INDEX "study_room_messages_messageType_idx" ON "study_room_messages"("messageType");

-- CreateIndex
CREATE INDEX "study_room_messages_createdAt_idx" ON "study_room_messages"("createdAt");

-- CreateIndex
CREATE INDEX "feedback_reports_userId_idx" ON "feedback_reports"("userId");

-- CreateIndex
CREATE INDEX "feedback_reports_type_idx" ON "feedback_reports"("type");

-- CreateIndex
CREATE INDEX "feedback_reports_status_idx" ON "feedback_reports"("status");

-- CreateIndex
CREATE INDEX "feedback_reports_priority_idx" ON "feedback_reports"("priority");

-- CreateIndex
CREATE INDEX "feedback_reports_createdAt_idx" ON "feedback_reports"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE INDEX "reviews_marketplaceItemId_idx" ON "reviews"("marketplaceItemId");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");

-- CreateIndex
CREATE INDEX "marketplace_matches_marketplaceItemId_idx" ON "marketplace_matches"("marketplaceItemId");

-- CreateIndex
CREATE INDEX "marketplace_matches_buyerId_idx" ON "marketplace_matches"("buyerId");

-- CreateIndex
CREATE INDEX "marketplace_matches_sellerId_idx" ON "marketplace_matches"("sellerId");

-- CreateIndex
CREATE INDEX "match_messages_matchId_idx" ON "match_messages"("matchId");

-- CreateIndex
CREATE INDEX "match_messages_senderId_idx" ON "match_messages"("senderId");

-- AddForeignKey
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_mundoId_fkey" FOREIGN KEY ("mundoId") REFERENCES "mundos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_items" ADD CONSTRAINT "video_items_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subtitles" ADD CONSTRAINT "subtitles_videoItemId_fkey" FOREIGN KEY ("videoItemId") REFERENCES "video_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_videoItemId_fkey" FOREIGN KEY ("videoItemId") REFERENCES "video_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_options" ADD CONSTRAINT "answer_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_personalityId_fkey" FOREIGN KEY ("personalityId") REFERENCES "personalities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_permissions" ADD CONSTRAINT "video_permissions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_permissions" ADD CONSTRAINT "video_permissions_videoItemId_fkey" FOREIGN KEY ("videoItemId") REFERENCES "video_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worlds" ADD CONSTRAINT "worlds_mundoId_fkey" FOREIGN KEY ("mundoId") REFERENCES "mundos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worlds" ADD CONSTRAINT "worlds_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_worldId_fkey" FOREIGN KEY ("worldId") REFERENCES "worlds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_videoItemId_fkey" FOREIGN KEY ("videoItemId") REFERENCES "video_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gamified_playlists" ADD CONSTRAINT "gamified_playlists_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gamified_playlists" ADD CONSTRAINT "gamified_playlists_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_questions" ADD CONSTRAINT "activity_questions_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_activityQuestionId_fkey" FOREIGN KEY ("activityQuestionId") REFERENCES "activity_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_answers" ADD CONSTRAINT "user_answers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merits" ADD CONSTRAINT "merits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transaction_to_wallet_fkey" FOREIGN KEY ("toUserId") REFERENCES "wallets"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transaction_from_wallet_fkey" FOREIGN KEY ("fromUserId") REFERENCES "wallets"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transaction_to_user_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transaction_from_user_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation_templates" ADD CONSTRAINT "invitation_templates_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_invitations" ADD CONSTRAINT "user_invitations_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_invitations" ADD CONSTRAINT "user_invitations_giftCardId_fkey" FOREIGN KEY ("giftCardId") REFERENCES "gift_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ui_component_templates" ADD CONSTRAINT "ui_component_templates_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_itemTypeId_fkey" FOREIGN KEY ("itemTypeId") REFERENCES "item_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_rewards" ADD CONSTRAINT "challenge_rewards_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_items" ADD CONSTRAINT "marketplace_items_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_rooms" ADD CONSTRAINT "study_rooms_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "video_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_rooms" ADD CONSTRAINT "study_rooms_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_room_participants" ADD CONSTRAINT "study_room_participants_studyRoomId_fkey" FOREIGN KEY ("studyRoomId") REFERENCES "study_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_room_participants" ADD CONSTRAINT "study_room_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_room_messages" ADD CONSTRAINT "study_room_messages_studyRoomId_fkey" FOREIGN KEY ("studyRoomId") REFERENCES "study_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_room_messages" ADD CONSTRAINT "study_room_messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_reports" ADD CONSTRAINT "feedback_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_reports" ADD CONSTRAINT "feedback_reports_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_marketplaceItemId_fkey" FOREIGN KEY ("marketplaceItemId") REFERENCES "marketplace_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_matches" ADD CONSTRAINT "marketplace_matches_marketplaceItemId_fkey" FOREIGN KEY ("marketplaceItemId") REFERENCES "marketplace_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_matches" ADD CONSTRAINT "marketplace_matches_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_matches" ADD CONSTRAINT "marketplace_matches_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_messages" ADD CONSTRAINT "match_messages_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "marketplace_matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_messages" ADD CONSTRAINT "match_messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
