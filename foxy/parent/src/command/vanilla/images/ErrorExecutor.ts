import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";

export default async function ErrorExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    var content = context.getOption<string>("text", false);
    context.sendDefer();

    if (content.length > 100) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:error.tooLong', { limit: "100" }))
        })
        endCommand();
    }

    const errorImage = await bot.generators.generateWindowsErrorImage(content);
    context.sendReply({
        file: {
            name: "error.png",
            blob: errorImage
        }
    })

    return endCommand();
}