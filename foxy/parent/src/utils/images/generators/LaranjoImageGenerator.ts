import Canvas, { CanvasRenderingContext2D } from 'canvas';
import { ImageConstants } from '../utils/ImageConstants';

export default class LaranjoImageGenerator {
    private canvas: Canvas.Canvas;
    private context: CanvasRenderingContext2D;

    constructor() {
        this.canvas = Canvas.createCanvas(700, 600);
        this.context = this.canvas.getContext("2d");
    }

    async generateImage(text: string): Promise<Blob> {
        const background = await Canvas.loadImage(ImageConstants.LARANJO_IMAGE);

        this.context.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeStyle = '#74037b';
        this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.font = '33px sans-serif';
        this.context.fillStyle = '#000000';
        this.context.fillText(text, this.canvas.width / 15.5, this.canvas.height / 13.5);

        this.context.beginPath();
        this.context.arc(125, 125, 100, 6, Math.PI * 2, true);
        this.context.closePath();
        this.context.clip();

        const blob = new Blob([this.canvas.toBuffer()], { type: "image/png" });
        return blob;
    }
}