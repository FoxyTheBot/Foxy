import i18next from "i18next";
import { bot } from "../FoxyLauncher";
import { logger } from "../utils/logger";
import { createEmbed } from "../utils/discord/Embed";
import { createActionRow, createButton } from "../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import UnleashedCommandExecutor from "../command/structures/UnleashedCommandExecutor";
import { prefix } from '../../config.json';

const setMessageCreateEvent = (): void => {
    bot.events.messageCreate = async (_, message) => {
        if (message.isFromBot || !message.authorId || message.authorId === bot.id) return;
        const { content, channelId, authorId, member } = message;
        const botMention = `<@${bot.id}>` || `<@!${bot.id}>`;

        if (content === botMention) {
            const botUsername = await bot.rest.foxy.getUserDisplayName(bot.id);
            return bot.helpers.sendMessage(channelId, {
                content: bot.locale("events:messageCreate.mentionMessage", {
                    botUsername,
                    author: `<@${member.id}>`
                })
            });
        }

        const user = await bot.database.getUser(await authorId);
        const locale = i18next.getFixedT(user.userSettings.language || 'pt-BR');
        const context = new UnleashedCommandExecutor(locale, message);

        bot.locale = locale;

        if (content.startsWith(prefix)) {
            const commandName = content.split(' ')[0].slice(2);
            const command = bot.commands.get(commandName) || bot.commands.find((cmd) => cmd.aliases?.includes(commandName));

            if (user.isBanned) {
                const banDate = user.banDate.toLocaleString(global.t.lng || 'pt-BR', {
                    timeZone: "America/Sao_Paulo",
                    hour: '2-digit',
                    minute: '2-digit',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                });
                const embed = createEmbed({
                    title: locale('events:ban.title'),
                    description: locale('events:ban.description'),
                    fields: [
                        { name: locale('events:ban.reason'), value: user.banReason },
                        { name: locale('events:ban.date'), value: banDate }
                    ]
                });
                return context.sendReply({
                    embeds: [embed],
                    components: [createActionRow([createButton({
                        label: locale('events:ban.button'),
                        style: ButtonStyles.Link,
                        emoji: { id: BigInt(bot.emotes.FOXY_CUPCAKE) },
                        url: 'https://forms.gle/bKfRKxoyFGZzRB7x8'
                    })])]
                });
            }

            if (command && command.supportsLegacy) {
                const args = content.split(' ').slice(1);
                try {
                    await command.execute(context, () => { }, locale, args);
                    if (bot.isProduction) {
                        logger.commandLog(command.name, await context.author,
                            context.guildId ? context.guildId.toString() : "DM",
                            args.join(", ") || 'Nenhum'
                        );

                        bot.database.updateCommand(command.name);
                    }
                } catch (error) {
                    logger.error(error);
                }
            } else if (command) {
                context.sendReply({
                    content: context.makeReply(
                        bot.emotes.FOXY_CRY, locale('events:messageCreate.commandNotSupported', {
                        command: command.name
                    }))
                });
            }
        }
    };
};

export { setMessageCreateEvent };