import { Attachment } from "discordeno/transformers";
import UnleashedCommandExecutor from "../../../command/structures/UnleashedCommandExecutor";
import Canvas, { CanvasRenderingContext2D } from 'canvas';
import { logger } from "../../../../../../common/utils/logger";
import { ImageConstants } from "../utils/ImageConstants";

export default class GostoMemeGenerator {
    private canvas: Canvas.Canvas;
    private context: CanvasRenderingContext2D;

    constructor() {
        this.canvas = Canvas.createCanvas(1080, 1260);
        this.context = this.canvas.getContext("2d");
    }

    async generateImage(context: UnleashedCommandExecutor, image1: Attachment, image2: Attachment, text: string) {
        try {
            const firstImage = await Canvas.loadImage(image1.url);
            const secondImage = await Canvas.loadImage(image2.url);

            const memeBackground = await Canvas.loadImage(ImageConstants.GOSTO_IMAGE);
            this.context.drawImage(memeBackground, 0, 0, this.canvas.width, this.canvas.height);

            const resizedFirstImage = await this.resizeImage(firstImage, 301, 301);
            const resizedSecondImage = await this.resizeImage(secondImage, 301, 301);

            this.context.drawImage(resizedFirstImage, 537, 517);
            this.context.drawImage(resizedSecondImage, 537, 837);

            this.context.font = "75px Calibri";
            this.context.fillStyle = "#ffffff";
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
            this.context.fillText(text, 540, 1200);

            const blob = new Blob([this.canvas.toBuffer()], { type: "image/png" });

            return blob;
        } catch (error) {
            logger.error(error);
            return null;
        }
    }

    private async resizeImage(image: Canvas.Image, width: number, height: number) {
        const canvas = Canvas.createCanvas(width, height);
        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0, width, height);

        return canvas;
    }
}