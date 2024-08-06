import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import NotStonksExecutor from "../NotStonksCommand";

const NotStonksCommand = createCommand({
    name: "notstonks",
    description: "[Image] Create an image of the not stonks",
    descriptionLocalizations: {
        "pt-BR": "[Imagem] Crie uma imagem do not stonks"
    },
    category: "image",
    supportsLegacy: false,
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
        NotStonksExecutor(context, endCommand, t);
    }
});

export default NotStonksCommand;