import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import ErrorExecutor from "../ErrorExecutor";

const ErrorCommand = createCommand({
    name: "error",
    description: "[Image] Create an error dialog box",
    descriptionLocalizations: {
        "pt-BR": "[Imagem] Crie uma caixa de dialogo de erro"
    },
    category: "image",
    supportsLegacy: true,
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
        ErrorExecutor(context, endCommand, t);
    }
});

export default ErrorCommand;