import { bot } from "../../../FoxyLauncher";
import { createEmbed } from "../../../utils/discord/Embed";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function SmileExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const smileGif: any = await context.getImage("smile");
    const embed = createEmbed({});
    
    embed.title = t('commands:smile.smiling', { author: await bot.foxyRest.getUserDisplayName(context.author.id) }),
        embed.image = {
            url: smileGif.url
        }

    context.sendReply({
        embeds: [embed],
    })
    endCommand();
}