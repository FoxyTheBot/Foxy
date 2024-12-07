import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class SmileExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const smileGif = await bot.rest.foxy.getImage("roleplay", "smile");
        const embed = createEmbed({});

        embed.title = t('commands:smile.smiling', { author: await bot.rest.foxy.getUserDisplayName((await context.getAuthor()).id) }),
            embed.image = {
                url: smileGif.url
            }

        context.reply({
            embeds: [embed],
        })
        return endCommand();
    }
}