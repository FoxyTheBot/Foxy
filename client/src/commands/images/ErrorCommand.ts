import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import * as Canvas from "canvas";

const ErrorCommand = createCommand({
    name: "error",  
    description: "[🖼] - Crie uma caixa de dialogo de erro",
    descriptionLocalizations: {
        "en-US": "[🖼] - Create an error dialog box"
    },
    category: "image",
    options: [
        {
            name: "text",
            nameLocalizations: {
                "pt-BR": "texto"
            },
            description: "Texto que será exibido na caixa de dialogo",
            descriptionLocalizations: {
                "en-US": "Text that will be displayed in the dialog box"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true  
        }
    ],
    execute: async (ctx, endCommand, t) => {
        var string = ctx.getOption<string>("text", false);
        const canvas = Canvas.createCanvas(380, 208);
        const context = canvas.getContext("2d");

        const background = await Canvas.loadImage("http://localhost:8080/memes/windows.png");
        context.drawImage(background, 0, 0, canvas.width, canvas.height);


        if (string.length > 30) {
            const check = string.match(/.{1,35}/g);
            string = check.join("\n");
        }
        if (string.length > 100) {
            ctx.foxyReply({
                content: t('commands:error.tooLong', { limit: 100 }),
            })
            endCommand();
        }

        context.strokeStyle = '#74037b';
        context.strokeRect(0, 0, canvas.width, canvas.height);

        context.font = '15px Sans';
        context.fillStyle = '#000000';
        context.fillText(`${string}`, canvas.width / 5.3, canvas.height / 2.2);

        context.beginPath();
        context.arc(125, 125, 100, 6, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const blob = new Blob([canvas.toBuffer()], { type: "image/png" });
        ctx.foxyReply({
            file: {
                name: "error.png",
                blob: blob
            }
        })

        endCommand();
    }
});

export default ErrorCommand;