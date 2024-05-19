import { User } from "discordeno";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { MessageFlags } from "../../../utils/discord/Message";
import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";

export default async function BiteExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const embed = createEmbed({});
    const user = await context.getOption<User>("user", "users");
    const biteGif: any = await context.getImage("bite");

    if (user.id === context.author.id) {
        context.sendReply({
            content: t('commands:bite.self'),
            flags: MessageFlags.EPHEMERAL
        });

        return endCommand();
    }

    if (user.id === bot.id) {
        context.sendReply({
            content: t('commands:bite.bot'),
            flags: MessageFlags.EPHEMERAL
        });

        return endCommand();
    }

    embed.title = t('commands:bite.success', { target: await bot.foxyRest.getUserDisplayName(user.id), user: await bot.foxyRest.getUserDisplayName(context.author.id) }),
        embed.image = {
            url: biteGif.url
        }

    context.sendReply({
        embeds: [embed],
    })
    endCommand();
}