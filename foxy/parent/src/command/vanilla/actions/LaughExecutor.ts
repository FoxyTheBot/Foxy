import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function LaughExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const embed = createEmbed({});

    const laughGif = await bot.rest.foxy.getImage("roleplay", "laugh");
    embed.title = t('commands:laugh.success', { author: await bot.rest.foxy.getUserDisplayName(context.author.id) }),
        embed.image = {
            url: laughGif.url
        }

    context.reply({
        embeds: [embed],
    })
    endCommand();
}