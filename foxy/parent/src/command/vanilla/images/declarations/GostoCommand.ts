import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import GostoExecutor from "../GostoExecutor";

const GostoCommand = createCommand({
    name: "gosto",
    description: "Show a brazilian meme called 'Não, não somos iguais'",
    descriptionLocalizations: {
        "pt-BR": "Você gosta disso e eu gosto daquilo, portanto, não somos iguais."
    },
    category: "image",
    options: [{
        name: "asset1",
        nameLocalizations: {
            "pt-BR": "imagem1"
        },
        description: "The first asset to show",
        descriptionLocalizations: {
            "pt-BR": "A primeira imagem a ser mostrada"
        },
        type: ApplicationCommandOptionTypes.Attachment,
        required: true
    },
    {
        name: "asset2",
        nameLocalizations: {
            "pt-BR": "imagem2"
        },
        description: "The second asset to show",
        descriptionLocalizations: {
            "pt-BR": "A segunda imagem a ser mostrada"
        },
        type: ApplicationCommandOptionTypes.Attachment,
        required: true,

    },
    {
        name: "text",
        nameLocalizations: {
            "pt-BR": "texto"
        },
        description: "The text to show",
        descriptionLocalizations: {
            "pt-BR": "O texto a ser mostrado"
        },
        type: ApplicationCommandOptionTypes.String,
        required: false
    }],

    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        new GostoExecutor().execute(context, endCommand, t);
    }
});

export default GostoCommand;