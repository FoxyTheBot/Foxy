import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import * as Canvas from "canvas";

const StonksCommand = createCommand({
    name: "stonks",
    description: "[🖼] - Crie uma imagem do stonks",
    descriptionLocalizations: {
        "en-US": "[🖼] - Create an image of the stonks"
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
    execute: async (ctx, endCommand, t) => {
        const content = ctx.getOption<string>("text", false);
        const canvas = Canvas.createCanvas(800, 600);
        const context = canvas.getContext("2d");

        const background = await Canvas.loadImage("http://localhost:8080/memes/stonks.png");
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#74037b';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = '28px sans-serif';
        context.fillStyle = '#000000';
        context.fillText(content, canvas.width / 15.5, canvas.height / 13.5);

        context.beginPath();
        context.arc(125, 125, 100, 6, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const blob = new Blob([canvas.toBuffer()], { type: "image/png" });
        ctx.foxyReply({
            file: {
                name: "stonks.png",
                blob
            }
        });
    }
});

export default StonksCommand;