import { bot } from "../../../FoxyLauncher";
import { User } from "discordeno/transformers";
import { ButtonStyles } from "discordeno/types";
import { createEmbed } from "../../../utils/discord/Embed";
import { MessageFlags } from "../../../utils/discord/Message";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { TransactionType } from "../../../structures/types/transaction";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function CakesExecutor(context: UnleashedCommandExecutor, endCommand, t) {
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
            const balance = userData.userCakes.balance;

            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:atm.success', { user: await bot.foxyRest.getUserDisplayName(user.id), balance: balance.toLocaleString(t.lng || 'pt-BR') }))
            })
            endCommand();
            break;
        }
        case "transfer": {
            const user = await context.getOption<User>('user', 'users');
            if (!user) {
                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
                });
                return endCommand();
            }
            const amount = await context.getOption<number>('amount', false, null, 2);
            if (isNaN(amount) || amount.toString().includes("0x") || amount < 0 || !Number.isInteger(parseFloat(amount.toString()))) {
                context.sendReply({
                    content: "nananinanão seu safado"
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
            if (value > authorData.userCakes.balance.valueOf()) {
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
            const user = await context.getOption<User>('user', 'users') ?? context.author;
            const userData = await bot.database.getUser(user.id);

            if (!await userData.userTransactions.length) {
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
            userData.userTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            userData.userTransactions.reverse();

            for (const transaction of userData.userTransactions) {
                switch (transaction.type) {
                    case TransactionType.DAILY: {
                        transactionsTexts.push(t('commands:transactions.dailyTransaction', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                        break;
                    }
                    case TransactionType.ADD_BY_ADMIN: {
                        transactionsTexts.push(t('commands:transactions.addedByAdmin', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                        break;
                    }

                    case TransactionType.SEND: {
                        transactionsTexts.push(t('commands:transactions.sentCakes', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString(), user: `@${(await bot.helpers.getUser(transaction.to)).username}` }))
                        break;
                    }

                    case TransactionType.RECEIVE: {
                        transactionsTexts.push(t('commands:transactions.receivedCakes', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString(), user: `@${(await bot.helpers.getUser((transaction.from))).username}` }))
                        break;
                    }

                    case TransactionType.SPENT_AT_STORE: {
                        transactionsTexts.push(t('commands:transactions.store', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                        break;
                    }

                    case TransactionType.BOUGHT: {
                        transactionsTexts.push(t('commands:transactions.bought', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                        break;
                    }

                    case TransactionType.PREMIUM_PERK: {
                        transactionsTexts.push(t('commands:transactions.premiumPerk', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                        break;
                    }

                    case TransactionType.VOTE_REWARD: {
                        transactionsTexts.push(t('commands:transactions.voteReward', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                    }

                    case 'bet': {
                        switch (transaction.received) {
                            case true: {
                                transactionsTexts.push(t('commands:transactions.betWon', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString(), userWhoSent: `@${(await bot.helpers.getUser(String(transaction.to)))}`, userWhoReceived: `@${(await bot.helpers.getUser(transaction.from))}` }))
                            }

                            case false: {
                                transactionsTexts.push(t('commands:transactions.betLost', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString(), userWhoSent: `@${(await bot.helpers.getUser(String(transaction.from)))}`, userWhoReceived: `@${(await bot.helpers.getUser(transaction.to))}` }))
                            }
                        }
                    }
                }
            }

            const transactions = transactionsTexts.reverse().slice(0, 10);
            const embed = createEmbed({
                title: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:transactions.title', { user: `@${user.username}` })),
                color: 0xfd446e,
                description: transactions.join('\n'),
                footer: {
                    text: t('commands:transactions.footer', { total: userData.userTransactions.length.toString() })
                },
            });

            return context.sendReply({
                embeds: [embed],
            });
        }
    }
}