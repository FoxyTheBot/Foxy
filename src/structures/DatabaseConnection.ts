import { Schema, connect, model } from 'mongoose';

export default class DatabaseConnection {
    private user: any;
    private client: any;

    constructor(auth: string, params: any, client: any) {
        connect(auth, params, (err) => {
            if (err) return console.log('Ocorreu um erro no cliente do mongodb! verifique se a sua URI está correta!', err);
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

        this.user = model('user', userSchema);
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

    async getAllUsers() {
        let usersData = await this.user.find({});
        return usersData.map(user => user.toJSON());
    }

}