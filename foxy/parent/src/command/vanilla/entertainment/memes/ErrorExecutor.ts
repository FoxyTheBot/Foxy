import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import { bot } from "../../../../FoxyLauncher";

export default class ErrorExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        var content = context.getOption<string>("text", false);
        context.sendDefer();

        if (content.length > 100) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:error.tooLong', { limit: "100" }))
            })
            endCommand();
        }

        const errorImage = await bot.rest.foxy.getArtistryImage("/memes/windowserror", {
            text: content
        });

        const file = new File([errorImage], "error.png", { type: "image/png" });
        context.reply({
            file: {
                name: "error.png",
                blob: file
            }
        })

        return endCommand();
    }
}