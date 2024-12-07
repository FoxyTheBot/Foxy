import { ExecutorParams } from "../../../structures/CommandExecutor";
import { bot } from "../../../../FoxyLauncher";

export default class NotStonksExecutor {
    async execute({ context, endCommand }: ExecutorParams) {
        const content = context.getOption<string>("text", false);
        context.sendDefer();

        const notStonksImage = await bot.rest.foxy.getArtistryImage("/memes/notstonks", {
            text: content
        });

        const file = new File([notStonksImage], "not_stonks.png", { type: "image/png" });

        context.reply({
            file: {
                name: "not_stonks.png",
                blob: file
            }
        })
        return endCommand();
    }
}