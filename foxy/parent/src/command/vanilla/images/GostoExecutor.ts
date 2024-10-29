import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { Attachment } from "discordeno/transformers";

const MAX_DIMENSION = 4096;
const CONTENT_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export default class GostoExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        context.sendDefer();
        const asset1 = await context.getOption<Attachment>("asset1", "attachments");
        const asset2 = await context.getOption<Attachment>("asset2", "attachments");
        const text = await context.getOption<string>("text", false) ?? "Não, não somos iguais";

        if (
            !CONTENT_TYPES.includes(asset1.contentType || "") ||
            !CONTENT_TYPES.includes(asset2.contentType || "")
        ) {
            return context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:gosto.invalidContentType")),
            });
        }

        if (
            (asset1.width ?? 0) > MAX_DIMENSION || 
            (asset1.height ?? 0) > MAX_DIMENSION ||
            (asset2.width ?? 0) > MAX_DIMENSION || 
            (asset2.height ?? 0) > MAX_DIMENSION ||
            (asset1.size ?? 0) > 8 * 1024 * 1024 ||
            (asset2.size ?? 0) > 8 * 1024 * 1024
        ) {
            return context.sendReply({
                content: context.makeReply(
                    bot.emotes.FOXY_CRY,
                    t("commands:gosto.fileTooBig", { max: MAX_DIMENSION })
                ),
            });
        }

        try {
            const gostoImage = await bot.rest.foxy.getArtistryImage("/memes/gosto", {
                asset1: asset1.url,
                asset2: asset2.url,
                text,
            });
            
            const file = new File([gostoImage], "naosomosiguais.png", { type: "image/png" });

            return context.sendReply({
                file: [{
                    name: `naosomosiguais_${Date.now()}.png`,
                    blob: file
                }],
            });
        } catch (error) {
            return context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:gosto.error")),
            });
        }
    }
}
