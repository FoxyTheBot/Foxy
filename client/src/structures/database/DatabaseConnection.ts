import mongoose, { ConnectOptions } from 'mongoose';
import { logger } from '../../utils/logger';
import { mongouri } from '../../../config.json';
import { bot } from '../../index';

export default class DatabaseConnection {
    private client: any;
    private user: any;
    private commands: any;
    private sessions: any;

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
            repCount: Number,
            lastRep: Date,
            background: String,
            backgrounds: Array,
            premiumType: String,
            language: String,
            mask: String,
            masks: Array,
            layout: String
        }, { versionKey: false, id: false });

        const commandsSchema = new mongoose.Schema({
            commandName: String,
            commandUsageCount: Number,
        }, { versionKey: false, id: false });

        const ticTacToeSession = new mongoose.Schema({
            commandId: String,
            user: {
                id: String,
                isYourTurn: Boolean,
                alreadyPlaying: Boolean
            },
            commandAuthor: {
                id: String,
                isYourTurn: Boolean,
                alreadyPlaying: Boolean
            }
        })
        this.user = mongoose.model('user', userSchema);
        this.commands = mongoose.model('commands', commandsSchema);
        this.sessions = mongoose.model('sessions', ticTacToeSession);
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

    async getSessionInfo(commandId: string): Promise<void> {
        let session = await this.sessions.findOne({ commandId: commandId });
        return session;
    }

    async verifyUser(userId: string) {
        let session = await this.sessions.findOne({ $or: [{ "user.id": userId }, { "commandAuthor.id": userId }] });
        console.log(session)
        if (!session) return false;
        return true;
    }

    async createSession(commandId: string, commandAuthor: any, user: any): Promise<void> {
        let session = new this.sessions({
            commandId: commandId,
            user: {
                id: user,
                isYourTurn: false,
                alreadyPlaying: true
            },
            commandAuthor: {
                id: commandAuthor,
                isYourTurn: true,
                alreadyPlaying: true
            }
        }).save();
        return session;
    }

    async finishSession(commandId: string): Promise<void> {
        return await this.sessions.findOneAndDelete({ commandId: commandId });
    }

    async updateSession(commandId: string, isAuthorTurn: boolean, isUserTurn): Promise<void> {
        let session = await this.sessions.findOne({ commandId: commandId });

        if (isAuthorTurn) {
            session.commandAuthor.isYourTurn = true;
            session.user.isYourTurn = false;
            return session.save();
        } if (isUserTurn) {
            session.commandAuthor.isYourTurn = false;
            session.user.isYourTurn = true;
            return session.save();
        }

        return session;
    }
    async getAllSessions(): Promise<void> {
        let sessionsData = await this.sessions.find({});
        return sessionsData.map(session => session.toJSON());
    }
    async getAllUsers(): Promise<void> {
        let usersData = await this.user.find({});
        return usersData.map(user => user.toJSON());
    }
}