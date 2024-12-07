import { ButtonStyles } from "discordeno";
import { createEmbed } from "../../../utils/discord/Embed";
import { bot } from "../../../FoxyLauncher";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { MessageFlags } from "../../../utils/discord/Message";
import { ExtendedUser } from "../../../structures/types/DiscordUser";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class HugExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const embed = createEmbed({});

        const user = await context.getOption<ExtendedUser>("user", "users");
        
        if (!user) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser')),
                flags: MessageFlags.EPHEMERAL
            });

            return endCommand();
        }

        const hugGif = await bot.rest.foxy.getImage("roleplay", "hug");
        embed.title = t('commands:hug.success', { user: await bot.rest.foxy.getUserDisplayName(user.id), author: await bot.rest.foxy.getUserDisplayName((await context.getAuthor()).id) }),
            embed.image = {
                url: hugGif.url
            }

        if (user.id === bot.id) {
            context.reply({
                embeds: [embed],
            });
            return endCommand();
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
                label: t('commands:hug.button'),
                style: ButtonStyles.Primary,
                emoji: {
                    id: BigInt(bot.emotes.FOXY_HUG)
                }
            })])]
        })
        return endCommand();
    }
}