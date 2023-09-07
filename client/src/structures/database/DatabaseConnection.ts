import mongoose, { ConnectOptions } from 'mongoose';
import { logger } from '../../utils/logger';
import { mongouri } from '../../../config.json';
import { bot } from '../../index';

export default class DatabaseConnection {
    private client: any;
    private user: any;
    private commands: any;
    private guilds: any;

    constructor(client) {
        mongoose.set("strictQuery", true)
        mongoose.connect(mongouri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions).catch((error) => {
            logger.error(`Failed to connect to database: `, error);
        });
        logger.info(`[DATABASE] Connected to database!`);
        const userSchema = new mongoose.Schema({
            _id: String,
            userCreationTimestamp: Date,
            premium: Boolean,
            premiumDate: Date,
            isBanned: Boolean,
            banData: Date,
            banReason: String,
            aboutme: String,
            balance: Number,
            lastDaily: Date,
            marriedWith: String,
            marriedDate: Date,
            cantMarry: Boolean,
            repCount: Number,
            lastRep: Date,
            background: String,
            backgrounds: Array,
            premiumType: String,
            language: String,
            mask: String,
            masks: Array,
            layout: String,
            transactions: [{
                to: String,
                from: String,
                quantity: Number,
                date: Date,
                received: Boolean,
                isFromDaily: Boolean,
                addedByAdmin: Boolean,
            }]
        }, { versionKey: false, id: false });

        const commandsSchema = new mongoose.Schema({
            commandName: String,
            commandUsageCount: Number,
        }, { versionKey: false, id: false });

        const guildSchema = new mongoose.Schema({
            _id: String,
            InviteBlockerModule: {
                isEnabled: Boolean,
                whitelistedInvites: Array,
                whitelistedChannels: Array,
                whitelistedRoles: Array,
                whitelistedUsers: Array,
                blockMessage: String,
            },
            AutoRoleModule: {
                isEnabled: Boolean,
                roles: Array,
            },
            GuildJoinLeaveModule: {
                isEnabled: Boolean,
                joinMessage: String,
                alertWhenUserLeaves: Boolean,
                leaveMessage: String,
                joinChannel: String,
                leaveChannel: String,
            }
        }, { versionKey: false, id: false });
        this.user = mongoose.model('user', userSchema);
        this.commands = mongoose.model('commands', commandsSchema);
        this.guilds = mongoose.model('guilds', guildSchema);
        this.client = client;
    }

    async getUser(userId: any): Promise<void> {
        const user = await bot.helpers.getUser(userId)

        if (!user) return null;

        let document = await this.user.findOne({ _id: userId });

        if (!document) {
            document = new this.user({
                _id: userId,
                userCreationTimestamp: Date.now(),
                premium: false,
                premiumDate: null,
                isBanned: false,
                banData: null,
                banReason: null,
                aboutme: null,
                balance: 0,
                lastDaily: null,
                marriedWith: null,
                marriedDate: null,
                cantMarry: false,
                repCount: 0,
                lastRep: null,
                background: "default",
                backgrounds: ["default"],
                premiumType: null,
                language: 'pt-BR',
                mask: null,
                masks: [],
                layout: "default"
            }).save();
        }

        return document;
    }

    async registerCommand(commandName: string): Promise<void> {
        let commandFromDB = await this.commands.findOne({ commandName: commandName });

        if (!commandFromDB) {
            commandFromDB = new this.commands({
                commandName: commandName,
                commandUsageCount: 0,
            }).save();
        } else {
            return null;
        }
    }
    async updateCommand(commandName: string): Promise<void> {
        let commandFromDB = await this.commands.findOne({ commandName: commandName });
        let command = await bot.commands.get(commandName);

        if (command.devsOnly) return null;
        if (!commandFromDB) {
            commandFromDB = new this.commands({
                commandName: commandName,
                commandUsageCount: 1,
            }).save();
        } else {
            commandFromDB.commandUsageCount++;
            commandFromDB.save();
        }

        return commandFromDB;
    }

    async getAllCommands(): Promise<void> {
        let commandsData = await this.commands.find({});
        return commandsData.map(command => command.toJSON());
    }

    async getAllUsageCount(): Promise<Number> {
        let commandsData = await this.commands.find({});
        let usageCount = 0;
        commandsData.map(command => usageCount += command.commandUsageCount);
        return usageCount;

    }

    async getGuild(guildId: BigInt) {
        let document = await this.guilds.findOne({ _id: guildId });

        if (!document) {
            document = new this.guilds({
                _id: guildId,
                InviteBlockerModule: {
                    isEnabled: false,
                    whitelistedInvites: [],
                    whitelistedChannels: [],
                    whitelistedRoles: [],
                    whitelistedUsers: [],
                    blockMessage: null,
                },
                AutoRoleModule: {
                    isEnabled: false,
                    roles: [],
                },
                GuildJoinLeaveModule: {
                    isEnabled: false,
                    joinMessage: null,
                    alertWhenUserLeaves: false,
                    leaveMessage: null,
                    joinChannel: null,
                    leaveChannel: null,
                }
            }).save();
        }

        return document;
    }

    async addGuild(guildId: BigInt) {
        let document = await this.guilds.findOne({ _id: guildId });

        if (!document) {
            document = new this.guilds({
                _id: guildId,
                InviteBlockerModule: {
                    isEnabled: false,
                    whitelistedInvites: [],
                    whitelistedChannels: [],
                    whitelistedRoles: [],
                    whitelistedUsers: [],
                    blockMessage: null,
                },
                AutoRoleModule: {
                    isEnabled: false,
                    roles: [],
                },
                GuildJoinLeaveModule: {
                    isEnabled: false,
                    joinMessage: null,
                    alertWhenUserLeaves: false,
                    leaveMessage: null,
                    joinChannel: null,
                    leaveChannel: null,
                }
            }).save();
            return null;
        }

        return document;
    }

    async removeGuild(guildId: BigInt) {
        let document = await this.guilds.findOne({ _id: guildId });

        if (document) {
            document.delete();
        } else {
            return null;
        }

        return document;
    }

    async getAllUsers(): Promise<void> {
        let usersData = await this.user.find({});
        return usersData.map(user => user.toJSON());
    }
}