import * as Canvas from "canvas";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";

export default async function ErrorExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    var content = context.getOption<string>("text", false);
    const canvas = Canvas.createCanvas(380, 208);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage(`${process.env.SERVER_URL}/assets/commands/memes/windows.png`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


    if (content.length > 30) {
        const check = content.match(/.{1,35}/g);
        content = check.join("\n");
    }
    if (content.length > 100) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:error.tooLong', { limit: "100" }))
        })
        endCommand();
    }

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '15px Sans';
    ctx.fillStyle = '#000000';
    ctx.fillText(content, canvas.width / 5.3, canvas.height / 2.2);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 6, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const blob = new Blob([canvas.toBuffer()], { type: "image/png" });
    context.sendReply({
        file: {
            name: "error.png",
            blob: blob
        }
    })

    endCommand();
}