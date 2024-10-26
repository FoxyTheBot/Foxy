import * as Canvas from "canvas";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function LaranjoExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const content = context.getOption<string>("text", false);
    const canvas = Canvas.createCanvas(700, 600);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage(`${process.env.SERVER_URL}/assets/commands/memes/laranjo.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '33px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(content, canvas.width / 15.5, canvas.height / 13.5);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const blob = new Blob([canvas.toBuffer()], { type: "image/png" });

    context.sendReply({
        file: {
            name: "laranja_laranjo.png",
            blob
        }
    });
    endCommand();
}