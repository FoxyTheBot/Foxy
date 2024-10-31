import { Attachment } from "discordeno/transformers";
import { bot } from "../../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";

const MAX_DIMENSION = 4096;
const CONTENT_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export default class ModaExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const image = await context.getOption<Attachment>("image", "attachments");
        context.sendDefer();

        if (
            !CONTENT_TYPES.includes(image.contentType || "")
        ) {
            return context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:moda.invalidContentType")),
            });
        }

        if (
            (image.width ?? 0) > MAX_DIMENSION || 
            (image.height ?? 0) > MAX_DIMENSION ||
            (image.size ?? 0) > 8 * 1024 * 1024
        ) {
            return context.sendReply({
                content: context.makeReply(
                    bot.emotes.FOXY_CRY,
                    t("commands:moda.fileTooBig", { max: MAX_DIMENSION })
                ),
            });
        }

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