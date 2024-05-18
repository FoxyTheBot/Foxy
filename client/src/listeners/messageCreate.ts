import i18next from "i18next";
import { bot } from "../FoxyLauncher";
import { logger } from "../utils/logger";
import { createEmbed } from "../utils/discord/Embed";
import { createActionRow, createButton } from "../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import ChatInputMessageContext from "../command/structures/ChatInputMessageContext";

const setMessageCreateEvent = (): void => {
    bot.events.messageCreate = async (_, message) => {
        if (message.isFromBot) return;
        if (message.content === `<@${bot.id}>` || message.content === `<@!${bot.id}>`) return bot.helpers.sendMessage(message.channelId, {
            content: bot.locale("events:messageCreate.mentionMessage",
                {
                    botUsername: await bot.foxyRest.getUserDisplayName(bot.id), author: `<@${message.member.id}>`
                })
        });
        const context = new ChatInputMessageContext(message);
        const user = await bot.database.getUser(message.authorId);
        const locale = global.t = i18next.getFixedT(user.userSettings.language || 'pt-BR');
        bot.locale = locale;

        /* Legacy command handler for prefix commands */
        async function FoxyLegacyHandler() {
            try {
                if (!message.content.startsWith("f!")) return;
                const command = bot.commands.get(message.content.split(' ')[0].slice(2))
                    || bot.commands.find((cmd) => cmd.aliases?.includes(message.content.split(' ')[0].slice(2)));
                if (!command) return;

                const args = message.content.split(' ').slice(1);

                if (command && command.executeAsLegacy) {
                    await command.executeAsLegacy(context, args, locale);
                }
            } catch (error) {
                logger.error(error);
            }
        }

        try {
            if (user.isBanned) {
                const embed = createEmbed({
                    title: locale('events:ban.title'),
                    description: locale('events:ban.description'),
                    fields: [
                        { name: locale('events:ban.reason'), value: user.banReason },
                        { name: locale('events:ban.date'), value: user.banDate.toLocaleString(global.t.lng || 'pt-BR', { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }
                    ]
                })
                return context.sendReply({
                    embeds: [embed],
                    components: [createActionRow([createButton({
                        label: locale('events:ban.button'),
                        style: ButtonStyles.Link,
                        emoji: {
                            id: bot.emotes.FOXY_CUPCAKE
                        },
                        url: 'https://forms.gle/bKfRKxoyFGZzRB7x8'
                    })])]
                });


            }

            FoxyLegacyHandler();
        } catch (error) {
            logger.error(error);
        }
    }
}

export { setMessageCreateEvent }