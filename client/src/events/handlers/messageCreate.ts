import { bot } from "../../index";
import InviteBlockerModule from "../../utils/modules/InviteBlockerModule";

const setMessageCreateEvent = (): void => {
    bot.events.messageCreate = async (_, message) => {
        const InviteBlocker = new InviteBlockerModule(bot);
        InviteBlocker.checkMessage(message);

        if (message.content === `<@${bot.id}>` || message.content === `<@!${bot.id}>`) return bot.helpers.sendMessage(message.channelId, {
            content: bot.locale("events:messageCreate.mentionMessage",
                {
                    botUsername: await bot.foxyRest.getUserDisplayName(bot.id), author: `<@${message.member.id}>`
                })
        });
    }
}

export { setMessageCreateEvent }