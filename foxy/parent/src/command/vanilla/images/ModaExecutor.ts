import { Attachment } from "discordeno/transformers";
import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class ModaExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const image = await context.getOption<Attachment>("image", "attachments");
        context.sendDefer();

        const modaMeme = await bot.generators.generateModaImage(image);
        
        return context.sendReply({
            file: {
                name: "moda.png",
                blob: modaMeme
            }
        });
    }
}