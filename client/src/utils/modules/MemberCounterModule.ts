import { FoxyClient } from "../../structures/types/foxy";

export default class MemberCounterModule {
    public bot: FoxyClient

    constructor(bot) {
        this.bot = bot;
    }
}

async function updateMemberCounter(guildId: BigInt) {
    if (await this.bot.database.getGuild(guildId).MemberCounterModule.isEnabled) {
        const channels = await this.bot.database.getGuild(guildId).MemberCounterModule.channels;
        const message = await this.bot.database.getGuild(guildId).MemberCounterModule.message;
        
        const members = await this.bot.foxyRest.getServerMembers(guildId);

        for (const channel of channels) {
            await this.bot.foxyRest.updateChannel(channel, {
                name: message.replace("{counter}", members)
            });
        }
    }
}

export { updateMemberCounter }