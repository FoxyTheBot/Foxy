import { Attachment } from "discordeno/transformers";
import { bot } from "../../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";

export default class ModaExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const image = await context.getOption<Attachment>("image", "attachments");
        context.sendDefer();

        const modaMeme = await bot.rest.foxy.getArtistryImage("/memes/moda", {
            asset: image.url
        });
        
        const file = new File([modaMeme], "moda.png", { type: "image/png" });

        return context.sendReply({
            file: {
                name: "moda.png",
                blob: file
            }
        });
    }
}