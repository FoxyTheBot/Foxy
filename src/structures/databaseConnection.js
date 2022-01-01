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

        const pizzariaSchema = new mongoose.Schema({
            _id: String,
            name: String,
            description: String,
            animatronics: Array,
            foxcoins: Number,
            minigames: Array,
            createdAt: Date,
        }, { versionKey: false, id: false });

        const achievementSchema = new mongoose.Schema({
            _id: String,
            achievements: Array
        });

        this.achievement = mongoose.model('achievements', achievementSchema);
        this.user = mongoose.model('user', userSchema);
        this.shop = mongoose.model('Pizzarias', pizzariaSchema)
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

    async getAllUsers() {
        let usersData = await this.user.find({});
        return usersData.map(user => user.toJSON());
    }

    async getPizzariaInfoById(userId) {
        const document = await this.shop.findOne({ _id: userId });
        return document;
    }

    async getPizzariaInfoByName(name) {
        const document = await this.shop.findOne({ name: name });
        return document;
    }

    async registerPizzaria(name, description, id) {
        let document = await this.shop.findOne({ _id: id });
        if (document) return true;

        const pizzariaName = await this.shop.findOne({ name: name });
        if (pizzariaName) return false;

        document = new this.shop({
            _id: id,
            name: name,
            description: description,
            animatronics: [],
            foxcoins: 0,
            minigames: [],
            createdAt: new Date()
        }).save();
        return document;
    }
}