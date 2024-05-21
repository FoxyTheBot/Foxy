import { ButtonStyles, User } from "discordeno";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";
import { MessageFlags } from "../../../utils/discord/Message";
import { createEmbed } from "../../../utils/discord/Embed";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

export default async function KissExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>("user", "users");
    const kissGif: any = await context.getImage("kiss");
    const embed = createEmbed({});

    if (user.id === bot.id) {
        context.sendReply({
            content: t('commands:kiss.bot'),
            flags: MessageFlags.EPHEMERAL
        });

        return endCommand();
    }

    if (user.id === context.author.id) {
        context.sendReply({
            content: t('commands:kiss.self'),
            flags: MessageFlags.EPHEMERAL
        });

        return endCommand();
    }

    embed.title = t('commands:kiss.success', { user: await bot.rest.foxy.getUserDisplayName(user.id), author: await bot.rest.foxy.getUserDisplayName(context.author.id) }),
        embed.image = {
            url: kissGif.url
        }

    context.sendReply({
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
    endCommand();
}