import { BigString } from "discordeno/types";
import { FoxyClient } from "../structures/types/foxy";
import { User } from "../structures/types/user";

export class FoxyRestManager {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async sendDirectMessage(userId: BigString, data: Object) {
        const DMChannel = await this.bot.rest.runMethod(this.bot.rest, "POST", this.bot.constants.routes.USER_DM(), {
            recipient_id: userId
        });

        this.bot.helpers.sendMessage(DMChannel.id, data);
    }

    async getUserDisplayName(userId: BigString) {
        const user = await this.bot.rest.runMethod(this.bot.rest, "GET", this.bot.constants.routes.USER(userId));
        return user.global_name || user.username;
    }

    async getBotGuilds(): Promise<Array<Object>> {
        return await this.bot.rest.runMethod(this.bot.rest, "GET", this.bot.constants.routes.USER_GUILDS());
    }

    async getUser(userId: string): Promise<User> {
        return await this.bot.rest.runMethod(this.bot.rest, "GET", this.bot.constants.routes.USER(userId));
    }
}