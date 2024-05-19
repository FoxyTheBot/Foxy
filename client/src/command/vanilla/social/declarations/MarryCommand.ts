import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import MarryButtonExecutor from "../components/MarryButtonExecutor";
import MarryExecutor from "../MarryExecutor";

const MarryCommand = createCommand({
    name: 'marry',
    nameLocalizations: {
        "pt-BR": "casar"
    },
    description: "[Social] Marry your partner",
    descriptionLocalizations: {
        "pt-BR": "[Social] Case-se com seu parceiro(a)"
    },
    supportsLegacy: true,
    options: [{
        name: "ask",
        nameLocalizations: {
            "pt-BR": "pedir"
        },
        description: "[Social] Ask someone to marry you",
        descriptionLocalizations: {
            "pt-BR": "[Social] Peça alguém em casamento"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário",
            },
            description: "[Social] User you want to marry",
            descriptionLocalizations: {
                "pt-BR": "[Social] Usuário que você deseja casar"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }]
    },
    {
        name: "lock_requests",
        nameLocalizations: {
            "pt-BR": "bloquear_pedidos",
        },
        description: "[Social] Lock marriage requests",
        descriptionLocalizations: {
            "pt-BR": "[Social] Bloqueie pedidos de casamento"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "lock",
            nameLocalizations: {
                "pt-BR": "bloquear",
            },
            description: "[Social] Lock marriage requests",
            descriptionLocalizations: {
                "pt-BR": "[Social] Bloqueie pedidos de casamento"
            },
            type: ApplicationCommandOptionTypes.Boolean,
            required: true
        }]
    }
    ],
    category: "social",
    commandRelatedExecutions: [MarryButtonExecutor],

    execute: async (context, endCommand, t) => {
        MarryExecutor(context, endCommand, t);
    }
});

export default MarryCommand;