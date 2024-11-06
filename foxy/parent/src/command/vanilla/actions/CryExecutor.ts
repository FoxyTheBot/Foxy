import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class CryExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const embed = createEmbed({})
        const cryGif: any = await bot.rest.foxy.getImage("roleplay", "cry");
        embed.title = t('commands:cry.crying', { author: await bot.rest.foxy.getUserDisplayName(context.author.id) }),
            embed.image = {
                url: cryGif.url
            }

        context.reply({
            embeds: [embed],
        })
        return endCommand();
    }
}