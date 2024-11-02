import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from 'discordeno/types'
import RepExecutor from "../RepExecutor";

const RepCommand = createCommand({
    name: "rep",
    description: "[Social] Give reputation to a user",
    descriptionLocalizations: {
        "pt-BR": "[Social] Dê reputação para um usuário"
    },
    category: "social",
    supportsLegacy: true,
    options: [
        {
            name: "user",
            nameLocalizations: { "pt-BR": "usuário" },
            description: "The user you want to give reputation",
            descriptionLocalizations: {
                "pt-BR": "O usuário que você quer dar reputação"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        RepExecutor(context, endCommand, t);
    }
});

export default RepCommand;