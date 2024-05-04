import * as Canvas from "canvas";
import { serverURL } from '../../../../config.json';
import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";

export default async function StonksExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const content = context.getOption<string>("text", false);
    const canvas = Canvas.createCanvas(800, 600);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage(`${serverURL}/assets/commands/memes/stonks.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(content, canvas.width / 15.5, canvas.height / 13.5);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const blob = new Blob([canvas.toBuffer()], { type: "image/png" });
    context.sendReply({
        file: {
            name: "stonks.png",
            blob
        }
    });

    endCommand();
}