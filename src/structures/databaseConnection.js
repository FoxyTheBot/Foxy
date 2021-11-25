const mongoose = require('mongoose');

module.exports = class DatabaseConnection {
    constructor(uri, parameters, client) {
        mongoose.connect(uri, parameters, (stderr) => {
            if (stderr) return console.log('[ERROR] - Ocorreu um erro no cliente do mongodb! verifique se a sua URI está correta!', stderr);
        });

        const userSchema = new mongoose.Schema({
            _id: String,
            userCreation: Date,
            premium: Boolean,
            isBanned: Boolean,
            banReason: String,
            aboutme: String,
            balance: Number,
            lastDaily: Date,
            marriedWith: String,
            repCount: Number,
            lastRep: Date,
            background: String,
            backgrounds: Array
        }, { versionKey: false, id: false });

        this.user = mongoose.model('user', userSchema);
        this.client = client;
    }
    async getDocument(userID) {
        const user = await this.client.users.fetch(userID);

        if (!user) return null;

        let document = await this.user.findOne({ _id: userID });

        if (!document) {
            document = new this.user({
                _id: userID,
                userCreationTimestamp: Date.now(),
                premium: false,
                isBanned: false,
                banReason: null,
                aboutme: null,
                balance: 0,
                lastDaily: null,
                marriedWith: null,
                repCount: 0,
                lastRep: null,
                background: "default.png",
                backgrounds: ["default.png"]
            }).save();
        }

        return document;
    }
}