import { Attachment, User } from "discordeno/transformers";
import UnleashedCommandExecutor from "../../../command/structures/UnleashedCommandExecutor";
import Canvas, { CanvasRenderingContext2D } from 'canvas';
import { logger } from "../../../../../../common/utils/logger";
import { ImageConstants } from "../utils/ImageConstants";
import { getUserAvatar } from "../../discord/User";

export default class GirlfriendImageGenerator {
    private canvas: Canvas.Canvas;
    private context: CanvasRenderingContext2D;

    constructor() {
        this.canvas = Canvas.createCanvas(500, 510);
        this.context = this.canvas.getContext("2d");
    }

    async generateImage(user: User): Promise<Blob> {
        const avatar = getUserAvatar(user, { size: 2048 });
        const memeBackground = await Canvas.loadImage(ImageConstants.GIRLFRIEND_IMAGE);
        const avatarImage = await Canvas.loadImage(avatar);

        this.context.drawImage(memeBackground, 0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(avatarImage, 20, 170, 200, 200);

        const blob = new Blob([this.canvas.toBuffer()], { type: "image/png" });
        return blob;
    }
}