import { ButtonStyles, User } from "discordeno";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

export default async function HugExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const embed = createEmbed({});

    const user = await context.getOption<User>("user", "users");
    const hugGif: any = await context.getImage("hug");
    embed.title = t('commands:hug.success', { user: await bot.foxyRest.getUserDisplayName(user.id), author: await bot.foxyRest.getUserDisplayName(context.author.id) }),
        embed.image = {
            url: hugGif.url
        }

    if (user.id === bot.id) {
        context.sendReply({
            embeds: [embed],
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
                await bot.foxyRest.getUserDisplayName(user.id),
                context.isMessage ? context.message.id : null,
                context.isMessage ? context.channelId : null
            ),
            label: t('commands:hug.button'),
            style: ButtonStyles.Primary,
            emoji: {
                id: bot.emotes.FOXY_HUG
            }
        })])]
    })
    endCommand();
}