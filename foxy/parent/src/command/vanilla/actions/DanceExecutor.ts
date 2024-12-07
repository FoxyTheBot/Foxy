import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class DanceExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const embed = createEmbed({});
        const danceGif = await bot.rest.foxy.getImage("roleplay", "dance");

        embed.title = t('commands:dance.dancing', { author: await bot.rest.foxy.getUserDisplayName((await context.getAuthor()).id) }),
            embed.image = {
                url: danceGif.url
            }

        context.reply({
            embeds: [embed],
        })
        return endCommand();
    }
}
