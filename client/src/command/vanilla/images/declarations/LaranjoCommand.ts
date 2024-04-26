import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import LaranjoExecutor from "../LaranjoExecutor";

const LaranjoCommand = createCommand({
    name: "laranjo",
    description: "[Image] Create an image of the laranjo",
    descriptionLocalizations: {
        "pt-BR": "[Imagem] Crie uma imagem do laranjo"
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
            required: true
        }
    ],
    execute: async (context, endCommand, t) => {
        LaranjoExecutor(context, endCommand, t);
    }
});

export default LaranjoCommand;