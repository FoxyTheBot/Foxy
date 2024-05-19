import { createCommand } from "../../../structures/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import CakeTransferExecutor from "../components/CakeTransferExecutor";
import CakesExecutor from "../CakesExecutor";

const CakeCommand = createCommand({
    name: 'cakes',
    description: 'Commands related with Foxy economy system',
    descriptionLocalizations: {
        'pt-BR': 'Comandos relacionados a economia da Foxy'
    },
    aliases: ['atm', 'transfer', 'transactions'],
    supportsLegacy: true,
    options: [
        {
            name: "atm",
            description: "[Economy] See your amount of cakes",
            descriptionLocalizations: {
                'pt-BR': "[Economia] Veja a sua quantidade de cakes"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        'pt-BR': "usuário"
                    },
                    description: "See the amount of cakes of another user",
                    descriptionLocalizations: {
                        'pt-BR': "Veja a quantidade de cakes de outro usuário"
                    },
                    type: ApplicationCommandOptionTypes.User,
                    required: false
                }
            ]
        },
        {
            name: "transfer",
            nameLocalizations: {
                'pt-BR': "transferir"
            },
            description: "[Economy] Transfer cakes to another person",
            descriptionLocalizations: {
                'pt-BR': "[Economia] Envie cakes para outra pessoa"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        'pt-BR': "usuário"
                    },
                    description: "User you want to transfer",
                    descriptionLocalizations: {
                        'pt-BR': "Usuário que você quer transferir"
                    },
                    type: ApplicationCommandOptionTypes.User,
                    required: true
                },
                {
                    name: "amount",
                    nameLocalizations: {
                        'pt-BR': "quantidade"
                    },
                    description: "Amount of cakes you want to transfer",
                    descriptionLocalizations: {
                        'pt-BR': "Quantidade de cakes que você quer transferir"
                    },
                    type: ApplicationCommandOptionTypes.Number,
                    required: true,
                    minValue: 1
                }
            ]
        },
        {
            name: "transactions",
            nameLocalizations: {
                'pt-BR': "transações"
            },
            description: "[Economy] See your transactions",
            descriptionLocalizations: {
                'pt-BR': "[Economia] Veja suas transações"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "user",
                nameLocalizations: {
                    'pt-BR': "usuário"
                },
                description: "[Economy] See the transactions of a user",
                descriptionLocalizations: {
                    'pt-BR': "[Economia] Veja as transações de um usuário"
                },
                type: ApplicationCommandOptionTypes.User,
            }]
        }
    ],
    commandRelatedExecutions: [CakeTransferExecutor],
    category: 'economy',
    execute: async (context, endCommand, t) => {
        CakesExecutor(context, endCommand, t);
    },
});

export default CakeCommand;