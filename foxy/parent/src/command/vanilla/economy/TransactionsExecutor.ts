import { bot } from "../../../FoxyLauncher";
import { MessageFlags } from "../../../utils/discord/Message";
import { TransactionType } from "../../../structures/types/Transactions";
import { createEmbed } from "../../../utils/discord/Embed";
import { ExtendedUser } from "../../../structures/types/DiscordUser";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class TransactionsExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const user = await context.getOption<ExtendedUser>('user', 'users') ?? (await context.getAuthor());
        const userData = await bot.database.getUser(user.id);

        if (!userData.userTransactions.length) {
            if ((await context.getAuthor()).id === user.id) {
                return context.reply({
                    content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:transactions.noTransactions')),
                    flags: MessageFlags.EPHEMERAL
                }) && endCommand();
            } else {
                return context.reply({
                    content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:transactions.userHasNoTransactions', {
                        user: `<@${user.id}>`
                    })),
                    flags: MessageFlags.EPHEMERAL
                }) && endCommand();
            }
        }

        var transactionsTexts = [];

        context.sendDefer();
        userData.userTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        userData.userTransactions.reverse();

        for (const transaction of userData.userTransactions) {
            this.checkTransactionType(transaction, t, transactionsTexts);
        }

        const transactions = transactionsTexts.reverse().slice(0, 10);
        const embed = createEmbed({
            title: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:transactions.title', {
                user: `@${user.username}`
            })),
            color: bot.colors.FOXY_DEFAULT,
            description: transactions.join('\n'),
            footer: {
                text: t('commands:transactions.footer', { total: userData.userTransactions.length.toString() })
            }
        });

        return context.reply({ embeds: [embed] });
    }

    async checkTransactionType(transaction, t, transactionsTexts) {
        switch (transaction.type) {
            case TransactionType.DAILY_REWARD: {
                transactionsTexts.push(t('commands:transactions.dailyTransaction', {
                    date: new Date(transaction.date).toLocaleString(t.lng || 'pt-BR'),
                    amount: transaction.quantity.toString()
                }))

                break;
            }

            case TransactionType.ADD_BY_ADMIN: {
                transactionsTexts.push(t('commands:transactions.addedByAdmin', {
                    date: new Date(transaction.date).toLocaleString(t.lng || 'pt-BR'),
                    amount: transaction.quantity.toString()
                }))

                break;
            }

            case TransactionType.SEND: {
                const user = await bot.helpers.foxy.getUser(transaction.to);
                transactionsTexts.push(t('commands:transactions.send', {
                    date: new Date(transaction.date).toLocaleString(t.lng || 'pt-BR'),
                    amount: transaction.quantity.toString(),
                    user: `@${user.username}`
                }))

                break;
            }

            case TransactionType.RECEIVE: {
                const fromUser = await bot.helpers.foxy.getUser(transaction.from);
                transactionsTexts.push(t('commands:transactions.receive', {
                    date: new Date(transaction.date).toLocaleString(t.lng || 'pt-BR'),
                    amount: transaction.quantity.toString(),
                    user: `@${fromUser.username}`
                }));

                break;
            }

            case TransactionType.SPENT_AT_STORE: {
                transactionsTexts.push(t('commands:transactions.store', {
                    date: new Date(transaction.date).toLocaleString(t.lng || 'pt-BR'),
                    amount: transaction.quantity.toString(),
                }))

                break;
            }

            case TransactionType.BOUGHT: {
                transactionsTexts.push(t('commands:transactions.bought', {
                    date: new Date(transaction.date).toLocaleString(t.lng || 'pt-BR'),
                    amount: transaction.quantity.toString(),
                }))

                break;
            }

            case TransactionType.PREMIUM_PERK: {
                transactionsTexts.push(t('commands:transactions.premiumPerk', {
                    date: new Date(transaction.date).toLocaleString(t.lng || 'pt-BR'),
                    amount: transaction.quantity.toString(),
                }))

                break;
            }

            case TransactionType.VOTE_REWARD: {
                transactionsTexts.push(t('commands:transactions.voteReward', {
                    date: new Date(transaction.date).toLocaleString(t.lng || 'pt-BR'),
                    amount: transaction.quantity.toString(),
                }))

                break;
            }

            case TransactionType.ROULETTE: {
                transactionsTexts.push(t('commands:transactions.roulette', {
                    date: new Date(transaction.date).toLocaleString(t.lng || 'pt-BR'),
                    amount: transaction.quantity.toString(),
                }))

                break;
            }

            case TransactionType.BET: {
                switch (transaction.received) {
                    case true: {
                        transactionsTexts.push(t('commands:transactions.betWon', {
                            date: new Date(transaction.date).toLocaleString('pt-BR'),
                            amount: transaction.quantity.toString(),
                            userWhoSent: `@${(await bot.helpers.foxy.getUser(String(transaction.to)))}`,
                            userWhoReceived: `@${(await bot.helpers.foxy.getUser(transaction.from))}`
                        }));

                        break;
                    }

                    case false: {
                        transactionsTexts.push(t('commands:transactions.betLost', {
                            date: new Date(transaction.date).toLocaleString('pt-BR'),
                            amount: transaction.quantity.toString(),
                            userWhoSent: `@${(await bot.helpers.foxy.getUser(String(transaction.from)))}`,
                            userWhoReceived: `@${(await bot.helpers.foxy.getUser(transaction.to))}`
                        }))
                    }
                }
            }
        }
    }
}