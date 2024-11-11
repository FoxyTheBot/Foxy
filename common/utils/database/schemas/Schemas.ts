import mongoose from 'mongoose';

/* ========================= */
/*      User Related Schemas */
/* ========================= */

const keySchema = new mongoose.Schema({
    key: String,
    used: Boolean,
    expiresAt: Date,
    pType: Number,
    guild: String,
}, { versionKey: false, id: false });

const transactionSchema = new mongoose.Schema({
    to: String,
    from: String,
    quantity: Number,
    date: Date,
    received: Boolean,
    type: String
}, { versionKey: false, id: false });

const petSchema = new mongoose.Schema({
    name: String,
    type: String,
    rarity: String,
    level: Number,
    hungry: Number,
    happy: Number,
    health: Number,
    lastHungry: Date,
    lastHappy: Date,
    isDead: Boolean,
    isClean: Boolean,
    food: Array
}, { versionKey: false, id: false });

const userSchema = new mongoose.Schema({
    _id: {
        type: "String",
        required: true
    },
    userCreationTimestamp: Date,
    isBanned: Boolean,
    banDate: Date,
    banReason: String,
    userCakes: {
        balance: Number,
        lastDaily: Date,
    },
    marryStatus: {
        marriedWith: String,
        marriedDate: Date,
        cantMarry: Boolean,
    },
    userProfile: {
        decoration: String,
        decorationList: Array,
        background: String,
        backgroundList: Array,
        repCount: Number,
        lastRep: Date,
        layout: String,
        aboutme: String,
    },
    userPremium: {
        premium: Boolean,
        premiumDate: Date,
        premiumType: String,
    },
    userSettings: {
        language: String
    },
    petInfo: petSchema,
    userTransactions: [transactionSchema],
    riotAccount: {
        isLinked: Boolean,
        puuid: String,
        isPrivate: Boolean,
        region: String
    },
    premiumKeys: [keySchema],
    roulette: {
        availableSpins: Number,
    },
    lastVote: Date,
    notifiedForVote: Boolean,
    voteCount: Number,
}, { versionKey: false, id: false });

/* ========================= */
/*      Guild Related Schemas */
/* ========================= */

const keySchemaForGuilds = new mongoose.Schema({
    key: String,
    used: Boolean,
    expiresAt: Date,
    pType: Number,
    guild: String,
    owner: String,
}, { versionKey: false, id: false });

const dashboardLogsSchema = new mongoose.Schema({
    _id: String,
    user: String,
    action: String,
    date: Date,
}, { versionKey: false, id: false });

const guildSchema = new mongoose.Schema({
    _id: {
        type: "String",
        required: true
    },
    GuildJoinLeaveModule: {
        isEnabled: Boolean,
        joinMessage: String,
        alertWhenUserLeaves: Boolean,
        leaveMessage: String,
        joinChannel: String,
        leaveChannel: String,
    },
    AutoRoleModule: {
        isEnabled: Boolean,
        roles: Array,
    },
    premiumKeys: [keySchemaForGuilds],
    guildSettings: {
        prefix: String,
        disabledCommands: Array,
        blockedChannels: Array,
        sendMessageIfChannelIsBlocked: Boolean,
        deleteMessageIfCommandIsExecuted: Boolean,
        usersWhoCanAccessDashboard: Array,
    },
    dashboardLogs: [dashboardLogsSchema]
}, { versionKey: false, id: false });

/* ========================= */
/*      Bot Related Schemas   */
/* ========================= */

const subCommandSchema = new mongoose.Schema({
    name: String,
    description: String,
    nameLocalizations: {
        "pt-BR": String,
    },
    descriptionLocalizations: {
        "pt-BR": String,
    }
}, { versionKey: false, id: false });

const subCommandGroupSchema = new mongoose.Schema({
    name: String,
    nameLocalizations: {
        "pt-BR": String,
    },
    description: String,
    descriptionLocalizations: {
        "pt-BR": String,
    },
    subcommands: [subCommandSchema],
}, { versionKey: false, id: false });

const commandsSchema = new mongoose.Schema({
    commandName: String,
    commandUsageCount: Number,
    category: String,
    description: String,
    isInactive: Boolean,
    supportsLegacy: Boolean,
    subcommands: [subCommandSchema],
    subcommandGroups: [subCommandGroupSchema],
    usage: Array,
    nameLocalizations: {
        "pt-BR": String,
    },
    descriptionLocalizations: {
        "pt-BR": String,
    },
}, { versionKey: false, id: false });

const backgroundSchema = new mongoose.Schema({
    id: String,
    name: String,
    cakes: Number,
    filename: String,
    description: String,
    author: String,
    inactive: Boolean,
}, { versionKey: false, id: false });

const avatarDecorationSchema = new mongoose.Schema({
    id: String,
    name: String,
    cakes: Number,
    filename: String,
    description: String,
    inactive: Boolean,
    author: String,
    isMask: Boolean,
}, { versionKey: false, id: false });

const badgesSchema = new mongoose.Schema({
    id: String,
    name: String,
    asset: String,
    description: String,
    exclusive: Boolean,
    priority: Number,
    isFromGuild: String,
});

const positionSchema = new mongoose.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
}, { _id: false });

const fontSizeSchema = new mongoose.Schema({
    cakes: { type: Number, required: true },
    username: { type: Number, required: true },
    married: { type: Number, required: true },
    marriedSince: { type: Number, required: true },
    aboutme: { type: Number, required: true },
}, { _id: false });

const profileSettingsSchema = new mongoose.Schema({
    defaultFont: { type: String, required: true },
    aboutme: { limit: Number, breakLength: Number },
    fontSize: fontSizeSchema,
    positions: {
        avatarPosition: positionSchema,
        usernamePosition: positionSchema,
        aboutmePosition: positionSchema,
        marriedPosition: positionSchema,
        marriedSincePosition: positionSchema,
        marriedUsernamePosition: positionSchema,
        badgesPosition: positionSchema,
        decorationPosition: positionSchema,
        cakesPosition: positionSchema,
    },
}, { _id: false });

const layoutSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    filename: { type: String, required: true },
    description: { type: String, default: null },
    cakes: { type: Number, required: true },
    inactive: { type: Boolean, required: true },
    author: { type: String, default: null },
    darkText: { type: Boolean, required: true },
    profileSettings: profileSettingsSchema,
}, { versionKey: false, id: false });

export const Schemas = {
    userSchema,
    guildSchema,
    commandsSchema,
    backgroundSchema,
    keySchema,
    avatarDecorationSchema,
    badgesSchema,
    layoutSchema,
};