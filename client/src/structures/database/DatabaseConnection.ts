import mongoose from 'mongoose';
import { logger } from '../../utils/logger';
import { mongouri } from '../../../config.json';
import { bot } from '../../FoxyLauncher';
import { User } from 'discordeno/transformers';
import { FoxyClient } from '../types/foxy';
import { Schemas } from './schemas/Schemas';
import { Background } from '../types/background';
import { CommandInterface } from '../types/command';
import { ApplicationCommandOptionTypes } from 'discordeno/types';

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
    public badges: any;

    constructor(client) {
        this.client = client;
        this.connect();
        this.loadModels();
    }

    connect() {
        mongoose.set("strictQuery", true);
        mongoose.connect(mongouri)
            .then(() => logger.info(`[DATABASE] Connected to database!`))
            .catch(error => logger.error(`Failed to connect to database: `, error));
    }

    loadModels() {
        this.user = mongoose.model('user', Schemas.userSchema);
        this.commands = mongoose.model('commands', Schemas.commandsSchema);
        this.guilds = mongoose.model('guilds', Schemas.guildSchema);
        this.key = mongoose.model('key', Schemas.keySchema);
        this.badges = mongoose.model('badges', Schemas.badgesSchema);
        this.backgrounds = mongoose.model('backgrounds', Schemas.backgroundSchema);
        this.decorations = mongoose.model('decorations', Schemas.avatarDecorationSchema);
        this.riotAccount = mongoose.model('riotAccount', Schemas.riotAccountSchema);
    }

    createUser(userId: string) {
        return new this.user({
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
            riotAccount: {
                isLinked: false,
                puuid: null,
                isPrivate: false,
                region: null
            },
            premiumKeys: []
        });
    }

    createGuild(guildId: string) {
        return new this.guilds({
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
    }

    async getUser(userId: bigint): Promise<any> {
        if (!userId) return null;
        const user: User = bot.users.get(userId)
            ?? await bot.helpers.getUser(String(userId));
        let document = await this.user.findOne({ _id: (await user).id });

        if (!document) {
            document = this.createUser((await user).id.toString());
            await document.save();
        }

        return document;
    }

    async getBadges(): Promise<Badge[]> {
        return await this.badges.find({});
    }

    async registerCommand(command: CommandInterface): Promise<void> {
        const commandName = command.name;
        await this.commands.findOneAndUpdate(
            { commandName },
            {
                $set: {
                    description: command.description,
                    category: command.category,

                    // Localizations
                    nameLocalizations: command.nameLocalizations || {},
                    descriptionLocalizations: command.descriptionLocalizations || {},

                    // Subcommands
                    subcommands: command.options ?
                        command.options.map(option => {
                            if (option.type === ApplicationCommandOptionTypes.SubCommand) {
                                return {
                                    name: option.name,
                                    description: option.description,
                                    nameLocalizations: option.nameLocalizations,
                                    descriptionLocalizations: option.descriptionLocalizations,
                                }
                            }
                        }) || [] : [],

                    // Subcommand groups
                    subcommandGroups: command.options ?
                        command.options.map(option => {
                            if (option.type === ApplicationCommandOptionTypes.SubCommandGroup) {
                                return {
                                    name: option.name,
                                    description: option.description,
                                    nameLocalizations: {
                                        "pt-BR": option.nameLocalizations["pt-BR"] || null,
                                    },
                                    descriptionLocalizations: {
                                        "pt-BR": option.descriptionLocalizations["pt-BR"] || null,
                                    },
                                    subcommands: option.options.map(subcommand => {
                                        return {
                                            name: subcommand.name,
                                            description: subcommand.description,
                                            nameLocalizations: {
                                                "pt-BR": subcommand.nameLocalizations["pt-BR"] || null,
                                            },
                                            descriptionLocalizations: {
                                                "pt-BR": subcommand.descriptionLocalizations["pt-BR"] || null,
                                            },
                                        }
                                    })
                                }
                            }
                        }) || [] : [],
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

    async updateCommand(commandName: string): Promise<void> {
        let commandFromDB = await this.commands.findOneAndUpdate(
            { commandName },
            { $inc: { commandUsageCount: 1 } },
            { upsert: true, new: true }
        );

        let command = await bot.commands.get(commandName);

        if (!command || command.devsOnly) return null;

        return commandFromDB;
    }

    async getAllCommands(): Promise<any> {
        const commandsData = await this.commands.find({});
        return commandsData.map(command => command.toJSON());
    }

    async getCode(code: string): Promise<any> {
        const riotAccount = await this.riotAccount.findOne({ authCode: code });
        return riotAccount || null;
    }

    async getAllUsageCount(): Promise<number> {
        const commandsData = await this.commands.find({});
        return commandsData.reduce((acc, command) => acc + command.commandUsageCount, 0);
    }

    async getGuild(guildId: BigInt): Promise<any> {
        return await this.guilds.findOne({ _id: guildId });
    }

    async addGuild(guildId: BigInt): Promise<any> {
        let document = await this.guilds.findOne({ _id: guildId });

        if (!document) {
            document = this.createGuild(guildId.toString());
            await document.save();
        }

        return document;
    }

    async removeGuild(guildId: BigInt): Promise<boolean> {
        const result = await this.guilds.deleteOne({ _id: guildId });
        return result.deletedCount > 0;
    }

    async getAllUsers(): Promise<any> {
        const usersData = await this.user.find({});
        return usersData.map(user => user.toJSON());
    }

    async getAllGuilds(): Promise<number> {
        const guildsData = await this.guilds.find({});
        return guildsData.length;
    }

    async getAllBackgrounds(): Promise<Background[]> {
        const backgroundsData = await this.backgrounds.find({});
        return backgroundsData.map(background => background.toJSON());
    }

    async getAllDecorations(): Promise<any> {
        const decorationsData = await this.decorations.find({});
        return decorationsData.map(decoration => decoration.toJSON());
    }

    async getBackground(backgroundId: string): Promise<Background> {
        return await this.backgrounds.findOne({ id: backgroundId });
    }

    async getDecoration(decorationId: string): Promise<any> {
        return await this.decorations.findOne({ id: decorationId });
    }
}

