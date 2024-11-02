import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import BetButtonExecutor from "../components/BetButtonExecutor";
import BetExecutor from "../BetExecutor";

const BetCommand = createCommand({
    name: "bet",
    nameLocalizations: {
        "pt-BR": "apostar"
    },
    description: "[Economy] Bet your cakes",
    descriptionLocalizations: {
        "pt-BR": "[Economia] Aposte seus cakes"
    },
    category: 'economy',
    options: [
        {
            name: "coinflip",
            nameLocalizations: {
                "pt-BR": "caracoroa"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            description: "[Economy] Bet your cakes on a coinflip",
            descriptionLocalizations: {
                "pt-BR": "[Economia] Aposte seus cakes em uma cara coroa"
            },

            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        "pt-BR": "usuário"
                    },
                    description: "The user you want to bet on",
                    descriptionLocalizations: {
                        "pt-BR": "O usuário que você deseja apostar"
                    },
                    type: ApplicationCommandOptionTypes.User,
                    required: true
                },
                {
                    name: "amount",
                    nameLocalizations: {
                        "pt-BR": "quantidade"
                    },
                    description: "The amount of cakes you want to bet",
                    descriptionLocalizations: {
                        "pt-BR": "A quantidade de cakes que você deseja apostar"
                    },
                    type: ApplicationCommandOptionTypes.Integer,
                    required: true,
                    minValue: 1
                },
                {
                    name: "choice",
                    nameLocalizations: {
                        "pt-BR": "escolha"
                    },
                    description: "Select between head or tails",
                    descriptionLocalizations: {
                        "pt-BR": "Selecione entre cara ou coroa"
                    },
                    type: ApplicationCommandOptionTypes.String,
                    choices: [
                        {
                            name: "Heads",
                            nameLocalizations: {
                                "pt-BR": "Cara"
                            },
                            value: "heads"
                        },
                        {
                            name: "Tails",
                            nameLocalizations: {
                                "pt-BR": "Coroa"
                            },
                            value: "tails"
                        }
                    ],
                    required: true
                }
            ]
        }
    ],
    commandRelatedExecutions: [BetButtonExecutor],
    execute: async (context, endCommand, t) => {
        new BetExecutor().execute(context, endCommand, t);
    }
});

export default BetCommand;