import { Attachment } from "discordeno/transformers";
import { bot } from "../../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import { logger } from "../../../../../../../common/utils/logger";

const SUPPORTED_FORMATS = [
    "audio/mpeg",
    "audio/wav",
    "audio/aac",
    "audio/ogg",
    "audio/flac",
    "audio/opus",
    "audio/x-m4a",
    "video/mp4",
    "video/x-msvideo",
    "video/x-matroska",
    "video/ogg",
    "video/x-flv"
];

export default class EminemExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        try {
            context.sendDefer();
            const audio = await context.getOption<Attachment>("video_or_audio", "attachments");
            if (audio.size > 1024 * 1024 * 8) {
                return context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:8mile.audioTooLarge"))
                })
            }

            if (!SUPPORTED_FORMATS.includes(audio.contentType)) {
                return context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:8mile.unsupportedFormat"))
                })
            }

            const videoBuffer = await bot.rest.foxy.getArtistryImage("/memes/8mile", {
                url: audio.url,
                contentType: audio.contentType,
                size: audio.size
            });

            const file = new File([videoBuffer], "8mile.mp4", { type: "video/mp4" });

            return context.sendReply({
                file: {
                    name: "8mile.mp4",
                    blob: file
                }
            });
        } catch (error) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:8mile.error"))
            });
            logger.error(error);
        }
    }
}