import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { ButtonStyles, User } from "discordeno";
import { createEmbed } from "../../../utils/discord/Embed";
import { bot } from "../../../FoxyLauncher";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
export default async function TickleExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>("user", "users");
    const tickleGif = await bot.rest.foxy.getImage("roleplay", "tickle");
    const embed = createEmbed({});

    embed.title = t('commands:tickle.success', { user: await bot.rest.foxy.getUserDisplayName(user.id), author: await bot.rest.foxy.getUserDisplayName(context.author.id) }),
        embed.image = {
            url: tickleGif.url
        }

    if (user.id === bot.id) {
        embed.footer = {
            text: t('commands:tickle.bot')
        }
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
            label: t('commands:tickle.button'),
            style: ButtonStyles.Primary,
            emoji: {
                id: BigInt(bot.emotes.FOXY_CUPCAKE)
            }
        })])]
    })
    endCommand();
}