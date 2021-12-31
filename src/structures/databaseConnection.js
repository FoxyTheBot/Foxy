const mongoose = require('mongoose');

module.exports = class DatabaseConnection {
    constructor(uri, parameters, client) {
        mongoose.connect(uri, parameters, (stderr) => {
            if (stderr) return console.log('[ERROR] - Ocorreu um erro no cliente do mongodb! verifique se a sua URI está correta!', stderr);
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
            backgrounds: Array
        }, { versionKey: false, id: false });

        this.user = mongoose.model('user', userSchema);
        this.client = client;
    }
    async getUser(UserId) {
        const user = await this.client.users.fetch(UserId);

        if (!user) return null;

        let document = await this.user.findOne({ _id: UserId });

        if (!document) {
            document = new this.user({
                _id: UserId,
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

    getAllUsers() {
        this.user.find({}).exec(async function(err, users) {
            const list = await users.map(user => user.toJSON());
            return list;
        });
    }
}