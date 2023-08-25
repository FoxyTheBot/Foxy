import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import * as Canvas from "canvas";
import { CDNUrl } from '../../../config.json';

const NotStonksCommand = createCommand({
    name: "notstonks",
    description: "[Image] Create an image of the not stonks",
    descriptionLocalizations: {
        "pt-BR": "[Imagem] Crie uma imagem do not stonks"
    },
    category: "image",
    options: [
        {
            name: "text",
            nameLocalizations: {
                "pt-BR": "texto"
            },
            description: "Text that will be displayed in the image",
            descriptionLocalizations: {
                "pt-BR": "Texto que será exibido na imagem"
            },
            type: ApplicationCommandOptionTypes.String,

        }
    ],
    execute: async (context, endCommand, t) => {
        const content = context.getOption<string>("text", false);
        const canvas = Canvas.createCanvas(800, 600);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(`${CDNUrl}/memes/notstonks.png`);
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
});

export default NotStonksCommand;