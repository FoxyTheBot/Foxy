import { bot } from "../../index";
import InviteBlockerModule from "../../utils/modules/InviteBlockerModule";
import ValAutoRoleModule from "../../utils/modules/valAutoRoleModule";

const setMessageCreateEvent = (): void => {
    bot.events.messageCreate = async (_, message) => {
        const inviteRegex = /discord(?:app\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/i;
        const InviteBlocker = new InviteBlockerModule(bot);
        const valAutoRole = new ValAutoRoleModule(bot);
        valAutoRole.checkUser(message.member);
        if (inviteRegex.test(message.content)) {
            InviteBlocker.checkMessage(message);
        }

        if (message.content === `<@${bot.id}>` || message.content === `<@!${bot.id}>`) return bot.helpers.sendMessage(message.channelId, {
            content: bot.locale("events:messageCreate.mentionMessage",
                {
                    botUsername: await bot.foxyRest.getUserDisplayName(bot.id), author: `<@${message.member.id}>`
                })
        });
    }
}

export { setMessageCreateEvent }