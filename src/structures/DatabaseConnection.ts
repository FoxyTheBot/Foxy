import { Schema, connect, model } from 'mongoose';

export default class DatabaseConnection {
    private user: any;
    private client: any;
    private locale: any;
    public guild: any;

    constructor(auth: string, params: any, client: any) {
        connect(auth, params, (err) => {
            if (err) return console.error('Ocorreu um erro no cliente do mongodb! verifique se a sua URI está correta!', err);
        });

        const userSchema = new Schema({
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
            backgrounds: Array
        }, { versionKey: false, id: false });

        const guildSchema = new Schema({
            _id: String,
            guildCreationTimestamp: Date,
            disabledCommands: Array,
            disabledChannels: Array
        }, { versionKey: false, id: false });

        const localeSchema = new Schema({
            _id: String,
            locale: String
        });

        this.user = model('user', userSchema);
        this.locale = model('locale', localeSchema);
        this.guild = model('guild', guildSchema);
        this.client = client;
    }

    async getUser(userId: string) {
        const user = await this.client.users.fetch(userId);

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
                backgrounds: ["default"]
            }).save();
        }

        return document;
    }

    async registerGuild(guildId: string) {
        let document = await this.guild.findOne({ _id: guildId });

        if (!document) {
            document = new this.guild({
                _id: guildId,
                guildCreationTimestamp: Date.now(),
                disabledCommands: [],
                disabledChannels: []
            }).save();
        }

        return document;
    }

    async deleteGuild(guildId: string) {
        const guildData = await this.guild.findOne({ _id: guildId });
        return guildData.remove();
    }

    async getAllUsers() {
        let usersData = await this.user.find({});
        return usersData.map(user => user.toJSON());
    }

    async getUserLocale(userId) {
        const user = await this.client.users.fetch(userId);

        if (!user) return null;

        let document = await this.locale.findOne({ _id: userId });

        if (!document) {
            document = new this.locale({
                _id: userId,
                locale: 'pt-BR'
            }).save();
        }

        return document;
    }
}