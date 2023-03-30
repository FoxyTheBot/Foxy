import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { createCommand } from "../../structures/commands/createCommand";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { bot } from "../..";
import RollExecutor from "../../utils/commands/executors/util/RollExecutor";

const RollCommand = createCommand({
    name: "roll",
    nameLocalizations: {
        "pt-BR": "rolar"
    },
    category: "util",
    description: "[Utils] Roll a dice",
    descriptionLocalizations: {
        "pt-BR": "[Utilitários]" Rola um dado"
    },
    options: [{
        name: "dice",
        nameLocalizations: {
            "pt-BR": "dado"
        },
        description: "[Utils] roll a dice",
        descriptionLocalizations: {
            "pt-BR": "[Utilitários]" Rola um dado"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "sides",
            nameLocalizations: {
                "pt-BR": "lados"
            },
            description: "[Utils] Number of sides",
            descriptionLocalizations: {
                "pt-BR": "[Utilitários]" Número de lados"
            },
            type: ApplicationCommandOptionTypes.Integer,
            choices: [
                {
                    name: "2",
                    value: 2
                }, {
                    name: "3",
                    value: 3
                },
                {
                    name: "4",
                    value: 4
                },
                {
                    name: "5",
                    value: 5
                },
                {
                    name: "6",
                    value: 6
                },
                {
                    name: "7",
                    value: 7
                },
                {
                    name: "8",
                    value: 8
                },
                {
                    name: "9",
                    value: 9
                },
                {
                    name: "10",
                    value: 10
                },
                {
                    name: "12",
                    value: 12
                },
                {
                    name: "20",
                    value: 20
                },
                {
                    name: "100",
                    value: 100
                }
            ]
        }, {
            name: "amount",
            nameLocalizations: {
                "pt-BR": "quantidade"
            },
            description: "[Utils] Number of dices",
            descriptionLocalizations: {
                "pt-BR": "[Utilitários]" Número de dados"
            },
            type: ApplicationCommandOptionTypes.Integer,
            choices: [
                {
                    name: "1",
                    value: 1
                },
                {
                    name: "2",
                    value: 2
                }, {
                    name: "3",
                    value: 3
                },
                {
                    name: "4",
                    value: 4
                },
                {
                    name: "5",
                    value: 5
                },
                {
                    name: "6",
                    value: 6
                }
            ]
        }],
    }],
    commandRelatedExecutions: [RollExecutor],
    execute: async (context, endCommand, t) => {
        var amount = context.getOption<number>("amount", false);
        var sides = context.getOption<number>("sides", false);

        if (!amount) amount = 1;
        if (!sides) sides = 6;

        const roll = Math.floor(amount * Math.random() * sides) + 1;
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:roll.result', { amount: amount.toString(), sides: sides.toString(), result: roll.toString() })),
            components: [createActionRow([createButton({
                label: t('commands:roll.button'),
                style: ButtonStyles.Primary,
                emoji: {
                    id: bot.emotes.FOXY_YAY
                },
                customId: createCustomId(0, context.author.id, context.commandId, amount, sides)
            })])]
        });

        endCommand();
    }
});

export default RollCommand;