import i18next from "i18next";
import { bot } from "../FoxyLauncher";

const setMessageCreateEvent = (): void => {
    bot.events.messageCreate = async (_, message) => {
        if (message.isFromBot || !message.authorId || message.authorId === bot.id) return;
        const { content, channelId } = await message;
        const botMention = `<@${bot.id}>` || `<@!${bot.id}>`;
        const user = await bot.database.getUser(message.authorId);
        const locale = global.t = i18next.getFixedT(user.userSettings.language || 'pt-BR');

        if (content === botMention) {
            const botUsername = await bot.rest.foxy.getUserDisplayName(bot.id);
            return bot.helpers.sendMessage(channelId, {
                content: locale("events:messageCreate.mentionMessage", {
                    botUsername,
                    author: `<@${message.authorId}>`
                })
            });
        }
    };
};

export { setMessageCreateEvent };