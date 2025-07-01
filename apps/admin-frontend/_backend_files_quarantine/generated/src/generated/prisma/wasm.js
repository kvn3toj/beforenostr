
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.MundoScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  imageUrl: 'imageUrl',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  version: 'version'
};

exports.Prisma.PlaylistScalarFieldEnum = {
  id: 'id',
  mundoId: 'mundoId',
  name: 'name',
  description: 'description',
  imageUrl: 'imageUrl',
  orderInMundo: 'orderInMundo',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  version: 'version'
};

exports.Prisma.VideoItemScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  content: 'content',
  url: 'url',
  platform: 'platform',
  externalId: 'externalId',
  playlistId: 'playlistId',
  itemTypeId: 'itemTypeId',
  order: 'order',
  isActive: 'isActive',
  isDeleted: 'isDeleted',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  duration: 'duration',
  categories: 'categories',
  language: 'language',
  quality: 'quality',
  tags: 'tags',
  thumbnailUrl: 'thumbnailUrl'
};

exports.Prisma.SubtitleScalarFieldEnum = {
  id: 'id',
  videoItemId: 'videoItemId',
  languageCode: 'languageCode',
  format: 'format',
  content: 'content',
  contentUrl: 'contentUrl',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.QuestionScalarFieldEnum = {
  id: 'id',
  videoItemId: 'videoItemId',
  timestamp: 'timestamp',
  type: 'type',
  text: 'text',
  languageCode: 'languageCode',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  endTimestamp: 'endTimestamp'
};

exports.Prisma.AnswerOptionScalarFieldEnum = {
  id: 'id',
  questionId: 'questionId',
  text: 'text',
  isCorrect: 'isCorrect',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  avatarUrl: 'avatarUrl',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  username: 'username',
  firstName: 'firstName',
  lastName: 'lastName',
  documentType: 'documentType',
  documentNumber: 'documentNumber',
  phone: 'phone',
  country: 'country',
  address: 'address',
  status: 'status',
  topUserCount: 'topUserCount',
  personalityId: 'personalityId'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserRoleScalarFieldEnum = {
  userId: 'userId',
  roleId: 'roleId',
  assignedAt: 'assignedAt',
  assignedById: 'assignedById'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.VideoPermissionsScalarFieldEnum = {
  id: 'id',
  videoItemId: 'videoItemId',
  showWaveCount: 'showWaveCount',
  showVideos: 'showVideos',
  showVideoSubtitles: 'showVideoSubtitles',
  showComments: 'showComments',
  showPublishDate: 'showPublishDate',
  showVideoDuration: 'showVideoDuration',
  showLikeButton: 'showLikeButton',
  allowRewindForward: 'allowRewindForward',
  allowViewComments: 'allowViewComments',
  allowMakeComments: 'allowMakeComments',
  showLikeComments: 'showLikeComments',
  sortCommentsByAffinity: 'sortCommentsByAffinity',
  showCommenterName: 'showCommenterName',
  playlistPosition: 'playlistPosition',
  isDraft: 'isDraft',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById'
};

exports.Prisma.RolePermissionScalarFieldEnum = {
  roleId: 'roleId',
  permissionId: 'permissionId',
  assignedAt: 'assignedAt',
  assignedById: 'assignedById'
};

exports.Prisma.WorldScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  type: 'type',
  creatorId: 'creatorId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  mundoId: 'mundoId'
};

exports.Prisma.StageScalarFieldEnum = {
  id: 'id',
  worldId: 'worldId',
  name: 'name',
  order: 'order',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ExperienceScalarFieldEnum = {
  id: 'id',
  stageId: 'stageId',
  title: 'title',
  description: 'description',
  type: 'type',
  gamificationFramework: 'gamificationFramework',
  creatorId: 'creatorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ActivityScalarFieldEnum = {
  id: 'id',
  experienceId: 'experienceId',
  title: 'title',
  description: 'description',
  type: 'type',
  multimediaType: 'multimediaType',
  contentUrl: 'contentUrl',
  duration: 'duration',
  order: 'order',
  status: 'status',
  creatorId: 'creatorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  videoItemId: 'videoItemId'
};

exports.Prisma.GamifiedPlaylistScalarFieldEnum = {
  id: 'id',
  activityId: 'activityId',
  playlistId: 'playlistId',
  name: 'name',
  type: 'type',
  sequenceType: 'sequenceType',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ActivityQuestionScalarFieldEnum = {
  id: 'id',
  activityId: 'activityId',
  type: 'type',
  questionType: 'questionType',
  questionText: 'questionText',
  options: 'options',
  correctAnswer: 'correctAnswer',
  ondasList: 'ondasList',
  displayTimeSeconds: 'displayTimeSeconds',
  optionalDisplaySeconds: 'optionalDisplaySeconds',
  createdAt: 'createdAt'
};

exports.Prisma.UserAnswerScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  questionId: 'questionId',
  activityQuestionId: 'activityQuestionId',
  answerGiven: 'answerGiven',
  isCorrect: 'isCorrect',
  ondasEarned: 'ondasEarned',
  createdAt: 'createdAt'
};

exports.Prisma.TokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  amount: 'amount',
  type: 'type',
  status: 'status',
  caducityDate: 'caducityDate',
  source: 'source',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MeritScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  amount: 'amount',
  type: 'type',
  source: 'source',
  relatedEntityId: 'relatedEntityId',
  createdAt: 'createdAt'
};

exports.Prisma.WalletScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  blockchainAddress: 'blockchainAddress',
  balanceUnits: 'balanceUnits',
  balanceToins: 'balanceToins',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  fromUserId: 'fromUserId',
  toUserId: 'toUserId',
  amount: 'amount',
  tokenType: 'tokenType',
  type: 'type',
  status: 'status',
  description: 'description',
  createdAt: 'createdAt'
};

exports.Prisma.GroupScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  ownerId: 'ownerId',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserGroupScalarFieldEnum = {
  userId: 'userId',
  groupId: 'groupId',
  roleInGroup: 'roleInGroup',
  joinedAt: 'joinedAt'
};

exports.Prisma.PublicationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  content: 'content',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  publicationId: 'publicationId',
  activityId: 'activityId',
  text: 'text',
  createdAt: 'createdAt'
};

exports.Prisma.LikeScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  publicationId: 'publicationId',
  createdAt: 'createdAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  message: 'message',
  read: 'read',
  createdAt: 'createdAt'
};

exports.Prisma.InvitationTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  content: 'content',
  creatorId: 'creatorId',
  createdAt: 'createdAt'
};

exports.Prisma.GiftCardScalarFieldEnum = {
  id: 'id',
  inviterId: 'inviterId',
  invitedName: 'invitedName',
  invitedEmail: 'invitedEmail',
  token: 'token',
  unitsAmount: 'unitsAmount',
  suggestions: 'suggestions',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.UserInvitationScalarFieldEnum = {
  id: 'id',
  giftCardId: 'giftCardId',
  invitedUserId: 'invitedUserId',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.ReportScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  parameters: 'parameters',
  generatedAt: 'generatedAt',
  data: 'data',
  creatorId: 'creatorId'
};

exports.Prisma.ConfigurationScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  type: 'type',
  updatedAt: 'updatedAt'
};

exports.Prisma.LogScalarFieldEnum = {
  id: 'id',
  level: 'level',
  message: 'message',
  context: 'context',
  timestamp: 'timestamp',
  metadata: 'metadata'
};

exports.Prisma.AnalyticsDataScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  eventType: 'eventType',
  videoItemId: 'videoItemId',
  playlistId: 'playlistId',
  mundoId: 'mundoId',
  sessionId: 'sessionId',
  eventData: 'eventData',
  metadata: 'metadata',
  timestamp: 'timestamp',
  createdAt: 'createdAt'
};

exports.Prisma.RankingScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  period: 'period',
  data: 'data',
  createdAt: 'createdAt'
};

exports.Prisma.PersonalityScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  traits: 'traits',
  createdAt: 'createdAt'
};

exports.Prisma.UIComponentTemplateScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  templateJson: 'templateJson',
  creatorId: 'creatorId',
  createdAt: 'createdAt'
};

exports.Prisma.ItemTypeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  isActive: 'isActive',
  isDeleted: 'isDeleted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContentItemScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  content: 'content',
  playlistId: 'playlistId',
  itemTypeId: 'itemTypeId',
  order: 'order',
  isActive: 'isActive',
  isDeleted: 'isDeleted',
  deletedAt: 'deletedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChallengeScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  type: 'type',
  status: 'status',
  startDate: 'startDate',
  endDate: 'endDate',
  config: 'config',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChallengeRewardScalarFieldEnum = {
  id: 'id',
  challengeId: 'challengeId',
  type: 'type',
  amount: 'amount',
  description: 'description',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.UserChallengeScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  challengeId: 'challengeId',
  status: 'status',
  progress: 'progress',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  metadata: 'metadata'
};

exports.Prisma.MarketplaceItemScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  price: 'price',
  currency: 'currency',
  itemType: 'itemType',
  status: 'status',
  images: 'images',
  tags: 'tags',
  location: 'location',
  metadata: 'metadata',
  priceToins: 'priceToins',
  sellerId: 'sellerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isActive: 'isActive',
  isDeleted: 'isDeleted',
  deletedAt: 'deletedAt',
  viewCount: 'viewCount',
  favoriteCount: 'favoriteCount'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Currency = exports.$Enums.Currency = {
  UNIT: 'UNIT',
  USD: 'USD',
  EUR: 'EUR',
  BTC: 'BTC',
  ETH: 'ETH'
};

exports.MarketplaceItemType = exports.$Enums.MarketplaceItemType = {
  PRODUCT: 'PRODUCT',
  SERVICE: 'SERVICE',
  EXPERIENCE: 'EXPERIENCE',
  SKILL_EXCHANGE: 'SKILL_EXCHANGE',
  DIGITAL_CONTENT: 'DIGITAL_CONTENT'
};

exports.MarketplaceItemStatus = exports.$Enums.MarketplaceItemStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SOLD: 'SOLD',
  EXPIRED: 'EXPIRED',
  SUSPENDED: 'SUSPENDED'
};

exports.Prisma.ModelName = {
  Mundo: 'Mundo',
  Playlist: 'Playlist',
  VideoItem: 'VideoItem',
  Subtitle: 'Subtitle',
  Question: 'Question',
  AnswerOption: 'AnswerOption',
  User: 'User',
  Role: 'Role',
  UserRole: 'UserRole',
  Permission: 'Permission',
  VideoPermissions: 'VideoPermissions',
  RolePermission: 'RolePermission',
  World: 'World',
  Stage: 'Stage',
  Experience: 'Experience',
  Activity: 'Activity',
  GamifiedPlaylist: 'GamifiedPlaylist',
  ActivityQuestion: 'ActivityQuestion',
  UserAnswer: 'UserAnswer',
  Token: 'Token',
  Merit: 'Merit',
  Wallet: 'Wallet',
  Transaction: 'Transaction',
  Group: 'Group',
  UserGroup: 'UserGroup',
  Publication: 'Publication',
  Comment: 'Comment',
  Like: 'Like',
  Notification: 'Notification',
  InvitationTemplate: 'InvitationTemplate',
  GiftCard: 'GiftCard',
  UserInvitation: 'UserInvitation',
  Report: 'Report',
  Configuration: 'Configuration',
  Log: 'Log',
  AnalyticsData: 'AnalyticsData',
  Ranking: 'Ranking',
  Personality: 'Personality',
  UIComponentTemplate: 'UIComponentTemplate',
  ItemType: 'ItemType',
  ContentItem: 'ContentItem',
  Challenge: 'Challenge',
  ChallengeReward: 'ChallengeReward',
  UserChallenge: 'UserChallenge',
  MarketplaceItem: 'MarketplaceItem'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
