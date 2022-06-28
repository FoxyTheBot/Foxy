import mongoose, { ConnectOptions } from 'mongoose';
import { mongouri } from '../../../config.json';

export default class DatabaseConnection {
    private client: any;
    private user: any;

    constructor(client) {
        mongoose.connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true, writeConcern: "majority" } as ConnectOptions, (err) => {
            if (err) return console.error('Ocorreu um erro ao se conectar no Atlas do MongoDB!', err);
        });

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
        }, { versionKey: false, id: false });

        this.user = mongoose.model('user', userSchema);
        this.client = client;
    }

    async getUser(userId: String): Promise<void> {
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
                backgrounds: ["default"],
                premiumType: null,
                language: 'pt-BR'
            }).save();
        }

        return document;
    }

    async getAllUsers(): Promise<void> {
        let usersData = await this.user.find({});
        return usersData.map(user => user.toJSON());
    }
}