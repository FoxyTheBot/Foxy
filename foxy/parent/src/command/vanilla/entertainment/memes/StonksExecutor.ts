import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import { bot } from "../../../../FoxyLauncher";

export default class StonksExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        context.sendDefer();
        const content = context.getOption<string>("text", false);

        const stonksImage = await bot.rest.foxy.getArtistryImage("/memes/stonks", {
            text: content
        });

        const file = new File([stonksImage], "stonks.png", { type: "image/png" });

        context.reply({
            file: {
                name: "stonks.png",
                blob: file
            }
        });

        return endCommand();
    }
}