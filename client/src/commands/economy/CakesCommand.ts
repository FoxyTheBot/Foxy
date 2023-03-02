import { createCommand } from "../../structures/commands/createCommand";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from "../../index";
import { User } from "discordeno/transformers";
import { ButtonStyles } from "discordeno/types";
import CakeTransferExecutor from "../../utils/commands/executors/CakeTransferExecutor";

const CakeCommand = createCommand({
name: 'cakes',
    description: 'Commands related with economy system',
    descriptionLocalizations: {
        'pt-BR': 'Comandos relacionados ao sistema de economia'
    },
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
        }
    ],
    commandRelatedExecutions: [CakeTransferExecutor],
    category: 'economy',
    execute: async (context, endCommand, t) => {
        switch (context.getSubCommand()) {
            case "atm": {
                const user = await context.getOption<User>('user', 'users') ?? context.author;
                if (!user) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
                    });
                    return endCommand();
                }
                const userData = await bot.database.getUser(user.id);
                const balance = userData.balance;

                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:atm.success', { user: user.username, balance: balance.toString() }))
                })
                endCommand();
                break;
            }
            case "transfer": {
                const user = await context.getOption<User>('user', 'users');
                const amount = await context.getOption<number>('amount', false);
                if (!user) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
                    });
                    return endCommand();
                }

                const authorData = await bot.database.getUser(context.author.id);
                const coins = amount;

                const value = Math.round(coins);

                if (user.id === context.author.id) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:pay.self'))
                    })
                    return endCommand();
                }
                if (value > authorData.balance) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:pay.notEnough'))
                    })
                    return endCommand();
                }


                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:pay.alert', { amount: value.toString(), user: user.username })),
                    components: [createActionRow([createButton({
                        label: t('commands:pay.pay'),
                        style: ButtonStyles.Success,
                        customId: createCustomId(0, context.author.id, context.commandId, value, user.id),
                        emoji: {
                            id: bot.emotes.FOXY_DAILY
                        }
                    })])]
                });
                endCommand();
                break;
            }
        }
    }
});

export default CakeCommand;