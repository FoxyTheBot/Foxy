import * as Canvas from "canvas";
import { serverURL } from '../../../../config.json';
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function NotStonksExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const content = context.getOption<string>("text", "full-string");
    const canvas = Canvas.createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(`${serverURL}/assets/commands/memes/notstonks.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '40px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(content, canvas.width / 13.1, canvas.height / 14.1);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const blob = new Blob([canvas.toBuffer()], { type: "image/png" });
    context.sendReply({
        file: {
            name: "not_stonks.png",
            blob
        }
    })
    endCommand();
}