import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class DanceExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
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
