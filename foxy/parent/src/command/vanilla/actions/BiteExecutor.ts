import { MessageFlags } from "../../../utils/discord/Message";
import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import { ExtendedUser } from "../../../structures/types/DiscordUser";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class BiteExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const embed = createEmbed({});
        const user = await context.getOption<ExtendedUser>("user", "users");
        const biteGif = await bot.rest.foxy.getImage("roleplay", "bite");

        if (!user) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser')),
                flags: MessageFlags.EPHEMERAL
            });

            return endCommand();
        }

        if (user.id === (await context.getAuthor()).id) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_RAGE, t('commands:bite.self')),
                flags: MessageFlags.EPHEMERAL
            });

            return endCommand();
        }

        if (user.id === bot.id) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_RAGE, t('commands:bite.client')),
                flags: MessageFlags.EPHEMERAL
            });

            return endCommand();
        }

        embed.title = t('commands:bite.success', { target: await bot.rest.foxy.getUserDisplayName(user.id), user: await bot.rest.foxy.getUserDisplayName((await context.getAuthor()).id) }),
            embed.image = {
                url: biteGif.url
            }

        context.reply({
            embeds: [embed],
        })
        return endCommand();
    }
}