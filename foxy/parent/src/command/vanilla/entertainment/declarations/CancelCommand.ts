import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import CancelExecutor from "../CancelExecutor";

const cancelCommand = createCommand({
    name: 'cancel',
    nameLocalizations: {
        'pt-BR': 'cancelar'
    },
    description: "[Entertainment] Cancel someone",
    descriptionLocalizations: {
        "pt-BR": "[Entretenimento] Cancela alguém"
    },
    category: 'fun',
    supportsLegacy: true,
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "User you want to cancel",
            descriptionLocalizations: {
                "pt-BR": "Usuário que você quer cancelar"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        },
        {
            name: "reason",
            nameLocalizations: {
                "pt-BR": "motivo"
            },
            description: "Reason for the cancellation",
            descriptionLocalizations: {
                "pt-BR": "Motivo do cancelamento"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        new CancelExecutor().execute(context, endCommand, t);
    }
});

export default cancelCommand;