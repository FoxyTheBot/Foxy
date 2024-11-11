import mongoose from 'mongoose';
import { Schemas } from './schemas/Schemas';
import { CommandInterface } from '../../../foxy/parent/src/structures/types/CommandInterfaces';
import { DiscordUser } from 'discordeno/types';
import { Background, Badge, Decoration } from '../../types/UserProfile';
import { FoxyClient } from '../../../foxy/parent/src/structures/types/FoxyClient';
import { logger } from '../logger';
import { FoxyRestManager } from '../RestManager';
import { FoxyTransaction, FoxyUser } from './types/user';
import { FoxyGuild } from './types/guild';

export default class DatabaseConnection {
    public bot?: FoxyClient;
    public rest: FoxyRestManager;
    private cacheExpiration = 60000;
    private lastCacheUpdate = 0;
    private badgesCache: Badge[] = [];

    public models: { // TODO: Add types for each model
        user: any,
        commands: any,
        guilds: any,
        key: any,
        backgrounds: any,
        layouts: any,
        decorations: any,
        badges: any,
    } = {} as any;

    constructor(bot?: FoxyClient) {
        this.bot = bot;
        this.rest = new FoxyRestManager();
        this.connect();
        this.loadModels();
    }

    connect() {
        mongoose.set("strictQuery", true);
    
        const mongoURI = process.env.MONGO_URI;
        const mongoTimeout = Number(process.env.MONGO_TIMEOUT) || 10000;
    
        if (!mongoURI) {
            logger.error('MongoDB URI is not defined in environment variables');
            return;
        }
    
        mongoose.connect(mongoURI, {
            connectTimeoutMS: mongoTimeout,
            socketTimeoutMS: mongoTimeout,
        })
        .then(() => {
            logger.info(`[DATABASE] Connected to the database!`);
        })
        .catch(error => {
            logger.error(`Failed to connect to the database: `, error);
        });
    }
    

    close() {
        logger.info(`[DATABASE] Closing connection to database...`);
        mongoose.connection.close();
    }

    loadModels() {
        this.models.user = mongoose.model('user', Schemas.userSchema);
        this.models.commands = mongoose.model('commands', Schemas.commandsSchema);
        this.models.guilds = mongoose.model('guilds', Schemas.guildSchema);
        this.models.key = mongoose.model('key', Schemas.keySchema);
        this.models.badges = mongoose.model('badges', Schemas.badgesSchema);
        this.models.layouts = mongoose.model('layouts', Schemas.layoutSchema);
        this.models.backgrounds = mongoose.model('backgrounds', Schemas.backgroundSchema);
        this.models.decorations = mongoose.model('decorations', Schemas.avatarDecorationSchema);
    }

    createUser(userId: string) {
        return new this.models.user({
            _id: userId,
            userCreationTimestamp: new Date(),
            isBanned: false,
            banDate: null,
            banReason: null,
            userCakes: {
                balance: 0,
                lastDaily: null,
            },
            marryStatus: {
                marriedWith: null,
                marriedDate: null,
                cantMarry: false,
            },
            userProfile: {
                decoration: null,
                decorationList: [],
                background: "default",
                backgroundList: ["default"],
                repCount: 0,
                lastRep: null,
                layout: "default",
                aboutme: null,
            },
            userPremium: {
                premium: false,
                premiumDate: null,
                premiumType: null,
            },
            userSettings: {
                language: 'pt-br'
            },
            petInfo: {
                name: null,
                type: null,
                rarity: null,
                level: 0,
                hungry: 100,
                happy: 100,
                health: 100,
                lastHungry: null,
                lastHappy: null,
                isDead: false,
                isClean: true,
                food: []
            },
            userTransactions: [],
            premiumKeys: [],
            roulette: {
                availableSpins: 5,
            },
            lastVote: null,
            voteCount: 0,
            notifiedForVote: false,
        });
    }

    createGuild(guildId: string): Promise<FoxyGuild> {
        return new this.models.guilds({
            _id: guildId,
            GuildJoinLeaveModule: {
                isEnabled: false,
                joinMessage: null,
                alertWhenUserLeaves: false,
                leaveMessage: null,
                joinChannel: null,
                leaveChannel: null,
            },
            AutoRoleModule: {
                isEnabled: false,
                roles: []
            },
            premiumKeys: [],
            guildSettings: {
                prefix: process.env.DEFAULT_PREFIX,
                disabledCommands: [],
                blockedChannels: [],
                sendMessageIfChannelIsBlocked: false,
                deleteMessageIfCommandIsExecuted: false,
                usersWhoCanAccessDashboard: [],
            },
            dashboardLogs: []
        }).save();
    }

    async createTransaction(userId: bigint, transaction: FoxyTransaction) {
        await this.models.user.findOneAndUpdate(
            { _id: userId.toString() },
            {
                $push: {
                    userTransactions: {
                        to: transaction.to,
                        from: transaction.from ?? null,
                        quantity: transaction.quantity,
                        date: new Date(),
                        received: transaction.received,
                        type: transaction.type,
                    },
                },
            },
            { upsert: true, new: true }
        );

    }

    async getUser(userId: bigint): Promise<FoxyUser | null> {
        const user: DiscordUser | null = await this.rest.getUser(String(userId));
        if (!user) return null;
        let document = await this.models.user.findOne({ _id: user.id });
        if (!document) {
            document = this.createUser(user.id);
            await document.save();
        }
        return document;
    }

    async getBadges(): Promise<Badge[]> {
        const now = Date.now();
        if (this.badgesCache.length && now - this.lastCacheUpdate < this.cacheExpiration) {
            return this.badgesCache;
        }
        this.badgesCache = await this.models.badges.find({}).lean();
        this.lastCacheUpdate = now;
        return this.badgesCache;
    }

    async registerCommand(command: CommandInterface): Promise<void> {
        await this.models.commands.findOneAndUpdate(
            { commandName: command.name },
            {
                $set: {
                    description: command.description,
                    category: command.category,
                    nameLocalizations: command.nameLocalizations || {},
                    descriptionLocalizations: command.descriptionLocalizations || {},
                    supportsLegacy: command.supportsLegacy || false,
                },
                $setOnInsert: {
                    commandUsageCount: 0,
                    isInactive: false,
                    usage: null,
                }
            },
            { upsert: true, new: true }
        );
    }

    async updateCommand(commandName: string): Promise<any | null> {
        const commandFromDB = await this.models.commands.findOneAndUpdate(
            { commandName },
            { $inc: { commandUsageCount: 1 } },
            { upsert: true, new: true }
        );

        const command = await this.bot?.commands.get(commandName);
        if (!command || command.devsOnly) return null;
        return commandFromDB;
    }

    async getAllCommands(): Promise<any> {
        const commandsData = await this.models.commands.find({}).lean();
        return commandsData.map(command => command.toJSON());
    }

    async getAllUsageCount(): Promise<number> {
        const commandsData = await this.models.commands.find({}).lean();
        return commandsData.reduce((acc, command) => acc + command.commandUsageCount, 0);
    }

    async getGuild(guildId: BigInt): Promise<FoxyGuild> {
        const guild = await this.models.guilds.findOne({ _id: guildId });
        if (!guild) return this.createGuild(guildId.toString());

        return guild;
    }

    async addGuild(guildId: BigInt): Promise<any> {
        let document = await this.models.guilds.findOne({ _id: guildId });

        if (!document) {
            document = this.createGuild(guildId.toString());
            await document.save();
        }

        return document;
    }

    async removeGuild(guildId: BigInt): Promise<boolean> {
        const result = await this.models.guilds.deleteOne({ _id: guildId });
        return result.deletedCount > 0;
    }

    async getAllUsers(): Promise<any> {
        const usersData = await this.models.user.find({}).lean();
        return usersData.map(user => user.toJSON());
    }

    async getAllGuilds(): Promise<number> {
        const guildsData = await this.models.guilds.find({}).lean();
        return guildsData.length;
    }

    async getAllBackgrounds(): Promise<Background[]> {
        const backgroundsData = await this.models.backgrounds.find({}).lean();
        return backgroundsData.map(background => background.toJSON());
    }

    async getAllDecorations(): Promise<Decoration[]> {
        const decorationsData = await this.models.decorations.find({}).lean();
        return decorationsData.map(decoration => decoration.toJSON());
    }

    async getBackground(backgroundId: string): Promise<Background> {
        return await this.models.backgrounds.findOne({ id: backgroundId }).lean();
    }

    async getLayout(layoutId: string): Promise<Layout> {
        return await this.models.layouts.findOne({ id: layoutId }).lean();
    }

    async getDecoration(decorationId: string): Promise<Decoration> {
        return await this.models.decorations.findOne({ id: decorationId }).lean();
    }
}
interface ProfileSettings {
    defaultFont: string;
    aboutme: {
        limit: number;
        breakLength: number;
    }
    fontSize: {
        cakes: number;
        username: number;
        married: number;
        marriedSince: number;
        aboutme: number;
    };
    positions: {
        avatarPosition: Position;
        usernamePosition: Position;
        aboutmePosition: Position;
        marriedPosition: Position;
        marriedSincePosition: Position;
        marriedUsernamePosition: Position;
        badgesPosition: Position;
        decorationPosition: Position;
        cakesPosition: Position;
    };
}

interface Position {
    x: number;
    y: number;
}

export interface Layout {
    id: string;
    name: string;
    filename: string;
    description: string | null;
    cakes: number;
    inactive: boolean;
    author: string | null;
    darkText: boolean;
    profileSettings: ProfileSettings;
}