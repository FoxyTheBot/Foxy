import i18next, { TFunction } from "i18next";
import { bot } from "../FoxyLauncher";
import UnleashedCommandExecutor from "../command/structures/UnleashedCommandExecutor";
import { createEmbed } from "../utils/discord/Embed";
import { createActionRow, createButton } from "../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import { logger } from "../../../../common/utils/logger";
import { commandLogger } from "../utils/commandLogger";
import { FoxyGuild } from "../../../../common/utils/database/types/guild";
import { DiscordTimestamp } from "../structures/types/DiscordTimestamps";
import { Message } from "discordeno/transformers";
import { Bot } from "discordeno";

const commandCooldowns: Map<string, number> = new Map();
const initialCooldownTime = 1000;
const maxCooldownTime = 60000;
const cooldownIncreaseFactor = 2;

const setMessageCreateEvent = async (_: Bot, message: Message): Promise<unknown> => {
    if (message.isFromBot || !message.authorId || message.authorId === bot.id) return;

    const { channelId } = await message;
    const content = message.content.toLowerCase();
    const botMention = `<@${bot.id}>` || `<@!${bot.id}>`;
    const user = await bot.database.getUser(message.authorId);
    const locale = i18next.getFixedT(user.userSettings.language || 'pt-BR') as TFunction & { lng: string };
    const context = new UnleashedCommandExecutor(locale, message);

    let prefix = process.env.DEFAULT_PREFIX;
    let guild: FoxyGuild | null = null;

    if (message.guildId) {
        guild = await bot.database.getGuild(message.guildId);
        prefix = guild.guildSettings.prefix;
    }

    if (content === botMention) {
        const botUsername = await bot.rest.foxy.getUserDisplayName(bot.id);
        return context.reply({
            content: context.makeReply(bot.emotes.FOXY_CUPCAKE, locale("events:messageCreate.mentionMessage", {
                botUsername,
                commandAuthor: `<@${message.authorId}>`,
                prefix
            }))
        })
    }

    if (content.startsWith(`<@${bot.id}>`)) {
        prefix = `<@${bot.id}> `;
    }

    if (content.startsWith(prefix)) {
        bot.locale = locale;
        const commandName = content.slice(prefix.length).split(' ')[0];

        if (!commandName) return;

        const command = bot.commands.get(commandName)
            || bot.commands.find((cmd) => cmd.aliases?.includes(commandName));
        if (!command) return;

        const now = Date.now();
        const cooldownKey = `${message.authorId}-${commandName}`;
        const lastCommandTime = commandCooldowns.get(cooldownKey);
        let cooldownTime = initialCooldownTime;

        if (lastCommandTime) {
            const timeSinceLastCommand = now - lastCommandTime;
            if (timeSinceLastCommand < cooldownTime) {
                cooldownTime = Math.min(maxCooldownTime, cooldownTime * cooldownIncreaseFactor);

                setTimeout(() => {
                    return context.reply({
                        content: context.makeReply(bot.emotes.FOXY_RAGE, locale('events:messageCreate.commandCooldown', {
                            time: bot.helpers.foxy.convertToDiscordTimestamp(new Date(now + cooldownTime), DiscordTimestamp.RELATIVE)
                        }))
                    });
                }, cooldownTime);
                return;
            }
        }

        commandCooldowns.set(cooldownKey, now);

        if (guild?.guildSettings.sendMessageIfChannelIsBlocked && guild?.guildSettings.blockedChannels.includes(String(channelId))) {
            return context.reply({
                content: context.makeReply(bot.emotes.FOXY_RAGE, locale('events:messageCreate.blockedChannel'))
            });
        }

        if (guild?.guildSettings.blockedChannels.includes(String(channelId))) return;

        if (command && guild?.guildSettings.deleteMessageIfCommandIsExecuted) {
            try {
                await bot.helpers.deleteMessage(channelId, message.id);
            } catch (err) {
                logger.error("Can't delete message: ", err);
            }
        }

        if (user.isBanned) {
            const banDate = user.banDate.toLocaleString(locale.lng || 'pt-BR', {
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
            return context.reply({
                embeds: [embed],
                components: [createActionRow([createButton({
                    label: locale('events:ban.button'),
                    style: ButtonStyles.Link,
                    emoji: { id: BigInt(bot.emotes.FOXY_CUPCAKE) },
                    url: bot.foxy.constants.UNBAN_FORM_URL
                })])]
            });
        }

        if (command) {
            if (command.supportsLegacy) {
                const args = content.split(' ').slice(1);
                try {
                    await command.execute(context, () => { }, locale, args);
                    if (bot.isProduction) {
                        commandLogger.commandLog(command.name, (await context.getAuthor()),
                            context.guildId ? context.guildId.toString() : "DM",
                            args.join(", ") || 'Not applicable',
                        );
                        bot.database.updateCommand(command.name);
                    }
                } catch (error) {
                    logger.error(error);
                }
            } else {
                context.reply({
                    content: context.makeReply(
                        bot.emotes.FOXY_CRY, locale('events:messageCreate.commandNotSupported', {
                            command: command.name
                        }))
                });
            }
        }
    }
};

export { setMessageCreateEvent };