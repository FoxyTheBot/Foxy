import { Schema, connect, model } from 'mongoose';

export default class DatabaseConnection {
    private user: any;
    private client: any;
    private locale: any;
    public guild: any;

    constructor(auth: string, params: Object, client: any) {
        connect(auth, params, (err) => {
            if (err) return console.error('Ocorreu um erro ao se conectar no Atlas do MongoDB!', err);
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
            partner: Boolean,
            disabledCommands: Array,
            disabledChannels: Array,
            lang: String
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

    async getUser(userId: string): Promise<void> {
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

    async getAllUsers(): Promise<void> {
        let usersData = await this.user.find({});
        return usersData.map(user => user.toJSON());
    }

    async getUserLocale(userId: string): Promise<void> {
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