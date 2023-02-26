import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import * as Canvas from "canvas";

const LaranjoCommand = createCommand({
    name: "laranjo",
    description: "[Imagem] Crie uma imagem do laranjo",
    descriptionLocalizations: {
        "en-US": "[Image] Create an image of the laranjo"
    },
    category: "image",
    options: [
        {
            name: "text",
            nameLocalizations: {
                "pt-BR": "texto"
            },
            description: "Texto que será exibido na imagem",
            descriptionLocalizations: {
                "en-US": "Text that will be displayed in the image" 
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }
    ],
    execute: async (context, endCommand, t) => {
        const string = context.getOption<string>("text", false);
        const canvas = Canvas.createCanvas(700, 600);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage('http://localhost:8080/memes/laranjo.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '33px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${string}`, canvas.width / 15.5, canvas.height / 13.5);

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
});

export default LaranjoCommand;