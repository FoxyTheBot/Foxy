import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../../structures/createCommand";
import UnleashedCommandExecutor from "../../../structures/UnleashedCommandExecutor";
import ModaExecutor from "../ModaExecutor";

const ModaCommand = createCommand({
    name: "moda",
    description: "Brazilian meme: 'Before it becomes a trend, I'm warning you that I'm a fan of:'",
    descriptionLocalizations: {
        "pt-BR": "Montagem do meme 'Antes que vire moda, já vou avisando que sou fã de:'"
    },
    category: "image",

    options: [{
        name: "image",
        nameLocalizations: {
            "pt-BR": "imagem"
        },
        description: "Image to be used in the meme",
        descriptionLocalizations: {
            "pt-BR": "Imagem a ser usada no meme"
        },
        type: ApplicationCommandOptionTypes.Attachment,
        required: true
    }],

    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        new ModaExecutor().execute(context, endCommand, t);
    }
});

export default ModaCommand;