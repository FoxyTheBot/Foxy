import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import * as Canvas from "canvas";
import { serverURL } from "../../../config.json";
const ErrorCommand = createCommand({
    name: "error",
    description: "[Image] Create an error dialog box",
    descriptionLocalizations: {
        "pt-BR": "[Imagem] Crie uma caixa de dialogo de erro"
    },
    category: "image",
    options: [
        {
            name: "text",
            nameLocalizations: {
                "pt-BR": "texto"
            },
            description: "Text that will be displayed in the dialog box",
            descriptionLocalizations: {
                "pt-BR": "Texto que será exibido na caixa de dialogo"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }
    ],
    execute: async (context, endCommand, t) => {
        var string = context.getOption<string>("text", false);
        const canvas = Canvas.createCanvas(380, 208);
        const ctx = canvas.getContext("2d");

        const background = await Canvas.loadImage(`${serverURL}/memes/windows.png`);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);


        if (string.length > 30) {
            const check = string.match(/.{1,35}/g);
            string = check.join("\n");
        }
        if (string.length > 100) {
            context.sendReply({
                content: t('commands:error.tooLong', { limit: "100" }),
            })
            endCommand();
        }

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.font = '15px Sans';
        ctx.fillStyle = '#000000';
        ctx.fillText(`${string}`, canvas.width / 5.3, canvas.height / 2.2);

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
});

export default ErrorCommand;