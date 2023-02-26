import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import * as Canvas from "canvas";

const StonksCommand = createCommand({
    name: "stonks",
    description: "[Imagem] Crie uma imagem do stonks",
    descriptionLocalizations: {
        "en-US": "[Image] Create an image of the stonks"
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
        const content = context.getOption<string>("text", false);
        const canvas = Canvas.createCanvas(800, 600);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage("http://localhost:8080/memes/stonks.png");
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
});

export default StonksCommand;