import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import * as Canvas from "canvas";
import { serverURL } from '../../../../../config.json';

const StonksCommand = createCommand({
    name: "stonks",
    description: "[Image] Create an image of the stonks",
    descriptionLocalizations: {
        "pt-BR": "[Imagem] Crie uma imagem do stonks"
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
        
    }
});

export default StonksCommand;