import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import FateExecutor from "../FateExecutor";

const FateCommand = createCommand({
    name: 'fate',
    description: "[Entertainment] What is your fate with the person",
    descriptionLocalizations: {
        "pt-BR": "[Entretenimento] Qual o seu destino com a pessoa"
    },
    category: 'fun',
    supportsLegacy: true,
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "User you want to predict the fate",
            descriptionLocalizations: {
                "pt-BR": "Usuário que você quer prever o destino"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        new FateExecutor().execute(context, endCommand, t);
    }
});

export default FateCommand;