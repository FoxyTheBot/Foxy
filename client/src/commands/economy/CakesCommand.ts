import { createCommand } from "../../structures/commands/createCommand";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from "../../index";
import { User } from "discordeno/transformers";
import { ButtonStyles } from "discordeno/types";
import { createEmbed } from "../../utils/discord/Embed";
import { MessageFlags } from "../../utils/discord/Message";
import CakeTransferExecutor from "../../utils/commands/executors/economy/CakeTransferExecutor";

const CakeCommand = createCommand({
    name: 'cakes',
    description: 'Commands related with Foxy economy system',
    descriptionLocalizations: {
        'pt-BR': 'Comandos relacionados a economia da Foxy'
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
                    content: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:atm.success', { user: await bot.foxyRest.getUserDisplayName(user.id), balance: balance.toLocaleString(t.lng || 'pt-BR') }))
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
                    content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:pay.alert', { amount: value.toLocaleString(t.lng || 'pt-BR'), user: await bot.foxyRest.getUserDisplayName(user.id) })),
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

            case 'transactions': {
                const user = context.getOption<User>('user', 'users') ?? context.author;
                const userData = await bot.database.getUser(user.id);

                if (!await userData.transactions.length) {
                    if (context.author.id === user.id) {
                        return context.sendReply({
                            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:transactions.noTransactions')),
                            flags: MessageFlags.EPHEMERAL
                        }) && endCommand();
                    } else {
                        return context.sendReply({
                            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:transactions.userHasNoTransactions', { user: `<@${user.id}>` })),
                            flags: MessageFlags.EPHEMERAL
                        }) && endCommand();
                    }
                }
                var transactionsTexts = [];
        
                context.sendDefer();
                userData.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                userData.transactions.reverse();
        
                for (const transaction of userData.transactions) {
                    switch (transaction.type) {
                        case 'daily': {
                            transactionsTexts.push(t('commands:transactions.dailyTransaction', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                            break;
                        }
                        case 'addByAdmin': {
                            transactionsTexts.push(t('commands:transactions.addedByAdmin', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                            break;
                        }
                
                        case 'send': {
                            transactionsTexts.push(t('commands:transactions.sentCakes', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString(), user: `@${(await bot.helpers.getUser(transaction.to)).username}` }))
                            break;
                        }
                
                        case 'receive': {
                            transactionsTexts.push(t('commands:transactions.receivedCakes', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString(), user: `@${(await bot.helpers.getUser(transaction.from)).username}` }))
                            break;
                        }
                
                        case 'store': {
                            transactionsTexts.push(t('commands:transactions.store', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                            break;
                        }
                    }
                }
        
                const transactions = transactionsTexts.reverse().slice(0, 20);
                const embed = createEmbed({
                    title: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:transactions.title', { user: `@${user.username}` })),
                    color: 0xfd446e,
                    description: transactions.join('\n'),
                    thumbnail: {
                        url: "https://cdn.discordapp.com/attachments/774846266928136212/1149500383236993144/foxy_daily.png"
                    },
                    footer: {
                        text: t('commands:transactions.footer', { total: userData.transactions.length.toString() })
                    }
                });
        
                return context.sendReply({
                    embeds: [embed],
                });
            }
        }
    }
});

export default CakeCommand;