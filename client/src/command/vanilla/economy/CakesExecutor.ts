import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { bot } from "../../../index";
import { User } from "discordeno/transformers";
import { ButtonStyles } from "discordeno/types";
import { createEmbed } from "../../../utils/discord/Embed";
import { MessageFlags } from "../../../utils/discord/Message";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

export default async function CakesExecutor(context: ChatInputInteractionContext, endCommand, t) {
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

                    case 'bought': {
                        transactionsTexts.push(t('commands:transactions.bought', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                        break;
                    }

                    case 'premiumPerk': {
                        transactionsTexts.push(t('commands:transactions.premiumPerk', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                        break;
                    }

                    case 'voteReward': {
                        transactionsTexts.push(t('commands:transactions.voteReward', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString() }))
                    }

                    case 'bet': {
                        switch (transaction.received) {
                            case true: {
                                transactionsTexts.push(t('commands:transactions.betWon', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString(), userWhoSent: `@${(await bot.helpers.getUser(transaction.from))}`, userWhoReceived: `@${(await bot.helpers.getUser(transaction.to))}` }))
                            }

                            case false: {
                                transactionsTexts.push(t('commands:transactions.betLost', { date: new Date(transaction.date).toLocaleString('pt-BR'), amount: transaction.quantity.toString(), userWhoSent: `@${(await bot.helpers.getUser(transaction.from))}`, userWhoReceived: `@${(await bot.helpers.getUser(transaction.to))}` }))
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
                    text: t('commands:transactions.footer', { total: userData.transactions.length.toString() })
                },
            });

            return context.sendReply({
                embeds: [embed],
            });
        }
    }
}