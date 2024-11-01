import { ButtonStyles, User } from "discordeno";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { createEmbed } from "../../../utils/discord/Embed";
import { bot } from "../../../FoxyLauncher";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

export default async function PatExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>("user", "users");
    const patGif = await bot.rest.foxy.getImage("roleplay", "pat");
    const embed = createEmbed({});
    embed.title = t('commands:pat.success', { user: await bot.rest.foxy.getUserDisplayName(user.id), author: await bot.rest.foxy.getUserDisplayName(context.author.id) }),
        embed.image = {
            url: patGif.url
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
            label: t('commands:pat.button'),
            style: ButtonStyles.Primary,
            emoji: {
                id: BigInt(bot.emotes.FOXY_WOW)
            }
        })])]
    })
    endCommand();
}