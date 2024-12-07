import { Attachment } from "discordeno/transformers";
import { bot } from "../../../../FoxyLauncher";
import { ExecutorParams } from "../../../structures/CommandExecutor";

const MAX_DIMENSION = 4096;
const CONTENT_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export default class ModaExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const image = await context.getOption<Attachment>("image", "attachments");
        context.sendDefer();

        if (
            !CONTENT_TYPES.includes(image.contentType || "")
        ) {
            return context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:moda.invalidContentType")),
            });
        }

        if (
            (image.width ?? 0) > MAX_DIMENSION || 
            (image.height ?? 0) > MAX_DIMENSION ||
            (image.size ?? 0) > 8 * 1024 * 1024
        ) {
            return context.reply({
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

        context.reply({
            file: {
                name: "moda.png",
                blob: file
            }
        });

        return endCommand();
    }
}