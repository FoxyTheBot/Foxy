import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class CryExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const embed = createEmbed({})
        const cryGif: any = await bot.rest.foxy.getImage("roleplay", "cry");
        embed.title = t('commands:cry.crying', { author: await bot.rest.foxy.getUserDisplayName((await context.getAuthor()).id) }),
            embed.image = {
                url: cryGif.url
            }

        context.reply({
            embeds: [embed],
        })
        return endCommand();
    }
}