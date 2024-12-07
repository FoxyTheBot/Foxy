import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class LaughExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const embed = createEmbed({});

        const laughGif = await bot.rest.foxy.getImage("roleplay", "laugh");
        embed.title = t('commands:laugh.success', { author: await bot.rest.foxy.getUserDisplayName((await context.getAuthor()).id) }),
            embed.image = {
                url: laughGif.url
            }

        context.reply({
            embeds: [embed],
        })
        return endCommand();
    }
}