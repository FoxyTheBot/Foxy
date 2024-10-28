import Canvas, { CanvasRenderingContext2D } from 'canvas';
import { Attachment } from 'discordeno/transformers';
import { ImageConstants } from '../utils/ImageConstants';

export default class ModaImageGenerator {
    private canvas: Canvas.Canvas;
    private context: CanvasRenderingContext2D;

    constructor() {
        this.canvas = Canvas.createCanvas(589, 585);
        this.context = this.canvas.getContext('2d');
    }

    async generateImage(image: Attachment): Promise<Blob> {
        const memeBackground = await Canvas.loadImage(ImageConstants.MODA_IMAGE);

        this.context.drawImage(memeBackground, 0, 0, this.canvas.width, this.canvas.height);
        const resizedImage = await this.resizeImage(await Canvas.loadImage(image.url), 307, 307);
        this.context.drawImage(resizedImage, 257, 225);

        const blob = new Blob([this.canvas.toBuffer()], { type: 'image/png' });
        return blob;
    }

    private async resizeImage(image: Canvas.Image, width: number, height: number) {
        const canvas = Canvas.createCanvas(width, height);
        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0, width, height);

        return canvas;
    }
}