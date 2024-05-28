import { ButtonStyles, User } from "discordeno";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { createEmbed } from "../../../utils/discord/Embed";
import { bot } from "../../../FoxyLauncher";
import { MessageFlags } from "../../../utils/discord/Message";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

export default async function LickExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>("user", "users");
    const lickGif = await bot.rest.foxy.getImage("roleplay", "lick");
    const embed = createEmbed({});

    embed.title = t('commands:lick.success', { user: await bot.rest.foxy.getUserDisplayName(user.id), author: await bot.rest.foxy.getUserDisplayName(context.author.id) }),
        embed.image = {
            url: lickGif.url
        }

    if (user.id === bot.id) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:lick.bot')),
            flags: MessageFlags.EPHEMERAL
        });

        return endCommand();
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
            label: t('commands:lick.button'),
            style: ButtonStyles.Primary,
            emoji: {
                id: BigInt(bot.emotes.FOXY_CUPCAKE)
            }
        })])]
    })
    endCommand();
}