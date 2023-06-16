import { BigString } from "discordeno/types";
import { FoxyClient } from "../structures/types/foxy";

export class FoxyRestManager {
    public bot: FoxyClient;
    constructor(bot) {
        this.bot = bot;
    }

    async updateChannel(channelId: BigString, data: Object) {
        await this.bot.rest.runMethod(this.bot.rest, "PATCH", this.bot.constants.routes.CHANNEL(channelId)
            , { ...data })
    }

    async sendDirectMessage(userId: BigString, data: Object) {
        const DMChannel = await this.bot.rest.runMethod(this.bot.rest, "POST", this.bot.constants.routes.USER_DM(), {
            recipient_id: userId
        });

        this.bot.helpers.sendMessage(DMChannel.id, data);
    }

    async getUserDisplayName(userId: BigString) {
        const user = await this.bot.rest.runMethod(this.bot.rest, "GET", this.bot.constants.routes.USER(userId));
        return user.global_name || await this.bot.foxyRest.getUserDisplayName(user.id);
    }
}