import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class SmileExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const smileGif = await bot.rest.foxy.getImage("roleplay", "smile");
        const embed = createEmbed({});

        embed.title = t('commands:smile.smiling', { author: await bot.rest.foxy.getUserDisplayName(context.author.id) }),
            embed.image = {
                url: smileGif.url
            }

        context.reply({
            embeds: [embed],
        })
        return endCommand();
    }
}