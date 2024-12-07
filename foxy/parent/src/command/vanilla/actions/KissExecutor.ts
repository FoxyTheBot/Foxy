import { ButtonStyles } from "discordeno";
import { bot } from "../../../FoxyLauncher";
import { MessageFlags } from "../../../utils/discord/Message";
import { createEmbed } from "../../../utils/discord/Embed";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { ExtendedUser } from "../../../structures/types/DiscordUser";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class KissExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const user = await context.getOption<ExtendedUser>("user", "users");
        const kissGif = await bot.rest.foxy.getImage("roleplay", "kiss");
        const embed = createEmbed({});

        if (!user) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser')),
                flags: MessageFlags.EPHEMERAL
            });

            return endCommand();
        }

        if (user.id === bot.id) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:kiss.bot')),
                flags: MessageFlags.EPHEMERAL
            });

            return endCommand();
        }

        if (user.id === (await context.getAuthor()).id) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_SCARED, t('commands:kiss.self')),
                flags: MessageFlags.EPHEMERAL
            });

            return endCommand();
        }

        embed.title = t('commands:kiss.success', { user: await bot.rest.foxy.getUserDisplayName(user.id), author: await bot.rest.foxy.getUserDisplayName((await context.getAuthor()).id) }),
            embed.image = {
                url: kissGif.url
            }

        context.reply({
            embeds: [embed],
            components: [createActionRow([createButton({
                customId: createCustomId(
                    0,
                    user.id,
                    context.commandId,
                    await bot.rest.foxy.getUserDisplayName(user.id),
                    context.isMessage ? context.message.id : null,
                    context.isMessage ? context.channelId : null
                ),
                label: t('commands:kiss.button'),
                style: ButtonStyles.Primary,
                emoji: {
                    id: BigInt(bot.emotes.FOXY_CUPCAKE)
                }
            })])]
        })
        return endCommand();
    }
}