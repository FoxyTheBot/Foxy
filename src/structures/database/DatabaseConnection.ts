import mongoose, { ConnectOptions } from 'mongoose';
import user from './collections/User';
import premium from './collections/Premium';
import config from '../../../config.json';

export default class DatabaseConnection {
    public user: any;
    public premium; any;

    constructor() {
        mongoose.connect(config.mongouri, { useNewUrlParser: true, useUnifiedTopology: true, writeConcern: "majority" } as ConnectOptions, (err) => {
            if (err) {
                return console.error(err);
            }
        });

        this.user = mongoose.model("user", user);
        this.premium = mongoose.model("key", premium);
    }

    getUserByID(id: string) {
        return this.getUser({ id });
    }

    getUser(...args) {
        return this.user.findOne(...args);
    }

    async getUserAndDelete(id) {
        const data = await this.getUserByID(id);
        if (data) {
            return this.user.findOneAndDelete({ id });
        } else {
            return undefined;
        }
    }

    async getOrCreateUser(id: string, defaultValues = {}) {
        const data = await this.getUserByID(id);
        if (!data) {
            return this.user({ id, ...defaultValues }).save();
        }

        return data;
    }

    async getAllUsers() {
        let usersData = await this.user.find({});
        return usersData.map(user => user.toJSON());
    }
}