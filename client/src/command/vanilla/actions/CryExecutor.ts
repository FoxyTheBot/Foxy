import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function CryExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const embed = createEmbed({})
    const cryGif: any = await context.getImage("cry");
    embed.title = t('commands:cry.crying', { author: await bot.foxyRest.getUserDisplayName(context.author.id) }),
        embed.image = {
            url: cryGif.url
        }

    context.sendReply({
        embeds: [embed],
    })
    endCommand();
}