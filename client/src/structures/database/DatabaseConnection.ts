import mongoose from 'mongoose';
import { logger } from '../../utils/logger';
import { mongouri } from '../../../config.json';
import { bot } from '../../FoxyLauncher';
import { User } from 'discordeno/transformers';
import { FoxyClient } from '../types/foxy';
import { Schemas } from './schemas/Schemas';
import { Background } from '../types/background';

export default class DatabaseConnection {
    public client: FoxyClient;
    public key: any;
    public user: any;
    public commands: any;
    public guilds: any;
    public riotAccount: any;
    public backgrounds: any;
    public layouts: any;
    public decorations: any;

    constructor(client) {
        mongoose.set("strictQuery", true);
        mongoose.connect(mongouri).catch((error) => {
            logger.error(`Failed to connect to database: `, error);
        });
        logger.info(`[DATABASE] Connected to database!`);

        this.user = mongoose.model('user', Schemas.userSchema);
        this.commands = mongoose.model('commands', Schemas.commandsSchema);
        this.guilds = mongoose.model('guilds', Schemas.guildSchema);
        this.key = mongoose.model('key', Schemas.keySchema);
        this.backgrounds = mongoose.model('backgrounds', Schemas.backgroundSchema);
        this.decorations = mongoose.model('decorations', Schemas.avatarDecorationSchema);
        this.riotAccount = mongoose.model('riotAccount', Schemas.riotAccountSchema);
        this.client = client;

        this._createIndexes();
    }

    _createIndexes() {
        this.user.createIndexes({ _id: 1 });
        this.user.createIndexes({ 'riotAccount.authCode': 1 });
        this.commands.createIndexes({ commandName: 1 });
        this.guilds.createIndexes({ _id: 1 });
        this.backgrounds.createIndexes({ id: 1 });
        this.decorations.createIndexes({ id: 1 });
    }

    async getUser(userId: BigInt): Promise<any> {
        if (!userId) return null;
        const user: User = await bot.helpers.getUser(String(userId));
        let document = await this.user.findOne({ _id: user.id }).lean();

        if (!document) {
            document = new this.user({
                _id: user.id,
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
                riotAccount: {
                    isLinked: false,
                    puuid: null,
                    isPrivate: false,
                    region: null
                },
                premiumKeys: []
            });
            await document.save();
        }

        return document;
    }

    async registerCommand(commandName: string, commandDescription: string): Promise<void> {
        let commandFromDB = await this.commands.findOne({ commandName }).lean();

        if (!commandFromDB) {
            commandFromDB = new this.commands({
                commandName,
                commandUsageCount: 0,
                description: commandDescription,
                isInactive: false,
                subcommands: null,
                usage: null
            });
            await commandFromDB.save();
        } else {
            await this.commands.updateOne(
                { commandName },
                { $set: { description: commandDescription } }
            );
        }
    }

    async updateCommand(commandName: string): Promise<void> {
        let commandFromDB = await this.commands.findOneAndUpdate(
            { commandName },
            { $inc: { commandUsageCount: 1 } },
            { upsert: true, new: true, lean: true }
        );

        let command = await bot.commands.get(commandName);

        if (!command || command.devsOnly) return null;

        return commandFromDB;
    }

    async getAllCommands(): Promise<void> {
        let commandsData = await this.commands.find({}).lean();
        return commandsData.map(command => command);
    }

    async getCode(code: string): Promise<any> {
        const riotAccount = await this.riotAccount.findOne({ authCode: code }).lean();
        return riotAccount || null;
    }

    async getAllUsageCount(): Promise<Number> {
        let commandsData = await this.commands.find({}).lean();
        let usageCount = commandsData.reduce((acc, command) => acc + command.commandUsageCount, 0);
        return usageCount;
    }

    async getGuild(guildId: BigInt): Promise<any> {
        let document = await this.guilds.findOne({ _id: guildId }).lean();
        return document;
    }

    async addGuild(guildId: BigInt): Promise<any> {
        let document = await this.guilds.findOne({ _id: guildId }).lean();

        if (!document) {
            document = new this.guilds({
                _id: guildId,
                GuildJoinLeaveModule: {
                    isEnabled: false,
                    joinMessage: null,
                    alertWhenUserLeaves: false,
                    leaveMessage: null,
                    joinChannel: null,
                    leaveChannel: null,
                },
                valAutoRoleModule: {
                    isEnabled: false,
                    unratedRole: null,
                    ironRole: null,
                    bronzeRole: null,
                    silverRole: null,
                    goldRole: null,
                    platinumRole: null,
                    diamondRole: null,
                    ascendantRole: null,
                    immortalRole: null,
                    radiantRole: null,
                },
                premiumKeys: []
            });
            await document.save();
        }

        return document;
    }

    async removeGuild(guildId: BigInt): Promise<any> {
        let document = await this.guilds.findOneAndDelete({ _id: guildId }).lean();
        return document;
    }

    async getAllUsers(page: number = 1, limit: number = 100): Promise<void> {
        let usersData = await this.user.find({}).skip((page - 1) * limit).limit(limit).lean();
        return usersData.map(user => user);
    }

    async getAllGuilds(): Promise<number> {
        let guildsData = await this.guilds.find({}).lean();
        return guildsData.length;
    }

    async getAllBackgrounds(): Promise<Background[]> {
        let backgroundsData = await this.backgrounds.find({}).lean();
        return backgroundsData.map(background => background);
    }

    async getAllDecorations(): Promise<any> {
        let decorationsData = await this.decorations.find({}).lean();
        return decorationsData.map(decoration => decoration);
    }

    async getBackground(backgroundId: string): Promise<Background> {
        let background = await this.backgrounds.findOne({ id: backgroundId }).lean();
        return background;
    }

    async getDecoration(decorationId: string): Promise<any> {
        let decoration = await this.decorations.findOne({ id: decorationId }).lean();
        return decoration;
    }
}