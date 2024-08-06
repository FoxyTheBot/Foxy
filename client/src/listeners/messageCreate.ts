import i18next from "i18next";
import { bot } from "../FoxyLauncher";

const setMessageCreateEvent = (): void => {
    bot.events.messageCreate = async (_, message) => {
        if (message.isFromBot || !message.authorId || message.authorId === bot.id) return;
        const { content, channelId, member } = await message;
        const botMention = `<@${bot.id}>` || `<@!${bot.id}>`;
        const user = await bot.database.getUser(member.id);
        const locale = global.t = i18next.getFixedT(user.userSettings.language || 'pt-BR');

        if (content === botMention) {
            const botUsername = await bot.rest.foxy.getUserDisplayName(bot.id);
            return bot.helpers.sendMessage(channelId, {
                content: locale("events:messageCreate.mentionMessage", {
                    botUsername,
                    author: `<@${member.id}>`
                })
            });
        }
    };
};

export { setMessageCreateEvent };