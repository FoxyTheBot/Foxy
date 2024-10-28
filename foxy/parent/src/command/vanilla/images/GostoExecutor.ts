import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import Canvas from "canvas";
import { Attachment } from "discordeno/transformers";

const MAX_DIMENSION = 4096;
const IMAGE_SIZE = 301;
const CONTENT_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export default class GostoExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        context.sendDefer();

        const asset1 = await context.getOption<Attachment>("asset1", "attachments");
        const asset2 = await context.getOption<Attachment>("asset2", "attachments");
        const text = context.getOption<string>("text", false) ?? "Não, não somos iguais!";

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
            const img1 = await Canvas.loadImage(asset1.url);
            const img2 = await Canvas.loadImage(asset2.url);

            const canvas = Canvas.createCanvas(1080, 1260);
            const ctx = canvas.getContext("2d");

            const memeBackground = await Canvas.loadImage(
                `${process.env.SERVER_URL}/assets/commands/memes/naosomosiguais.png`
            );

            ctx.drawImage(memeBackground, 0, 0, canvas.width, canvas.height);

            const resizedImg1 = await this.resizeImage(img1, IMAGE_SIZE, IMAGE_SIZE);
            const resizedImg2 = await this.resizeImage(img2, IMAGE_SIZE, IMAGE_SIZE);

            ctx.drawImage(resizedImg1, 537, 517);
            ctx.drawImage(resizedImg2, 537, 837);

            ctx.font = "75px Calibri";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(text, 540, 1200);

            const attachment = canvas.toBuffer("image/png");
            return context.sendReply({
                file: [{
                    name: `naosomosiguais_${Date.now()}.png`,
                    blob: new Blob([attachment], { type: "image/png" }),
                }],
            });
        } catch (error) {
            return context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:gosto.error")),
            });
        }
    }

    async resizeImage(image: Canvas.Image, width: number, height: number) {
        const canvas = Canvas.createCanvas(width, height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, width, height);
        return canvas;
    }
}
