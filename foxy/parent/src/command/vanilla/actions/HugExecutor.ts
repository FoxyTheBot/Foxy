import { ButtonStyles, User } from "discordeno";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

export default async function HugExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const embed = createEmbed({});

    const user = await context.getOption<User>("user", "users");
    const hugGif: any = await bot.rest.foxy.getImage("roleplay", "hug");
    embed.title = t('commands:hug.success', { user: await bot.rest.foxy.getUserDisplayName(user.id), author: await bot.rest.foxy.getUserDisplayName(context.author.id) }),
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
    endCommand();
}