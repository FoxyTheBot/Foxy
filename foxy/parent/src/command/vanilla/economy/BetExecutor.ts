import { User } from "discordeno/transformers";
import { bot } from "../../../FoxyLauncher";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class BetExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const user = await context.getOption<User>('user', 'users');
        const amount = context.getOption<number>('amount', false);
        const choice = context.getOption<string>('choice', false);
        let choices = ['heads', 'tails'];
        const rand = Math.floor(Math.random() * choices.length);

        const userData = await bot.database.getUser(context.author.id);
        const mentionedUserData = await bot.database.getUser(user.id);

        if (user.id === context.author.id) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:bet.self')),
                flags: 64
            });
            return endCommand();
        }

        if (userData.userCakes.balance < amount.valueOf()) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:bet.not-enough', { amount: amount.toLocaleString(t.lng || 'pt-BR'), user: await bot.rest.foxy.getUserDisplayName(context.author.id) })),
                flags: 64

            });

            return endCommand();
        }

        if (await mentionedUserData.userCakes.balance < amount.valueOf()) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:bet.not-enough-mention', { amount: amount.toLocaleString(t.lng || 'pt-BR'), user: await bot.rest.foxy.getUserDisplayName(user.id) })),
                flags: 64
            });

            return endCommand();
        }

        if (user.id === bot.id) {
            if (choice === choices[rand]) {
                context.reply({
                    content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:bet.betWithClient.win', { user: await bot.rest.foxy.getUserDisplayName(context.author.id), result: t(`commands:bet.${choices[rand]}`), amount: amount.toLocaleString(t.lng || 'pt-BR') })),
                    flags: 64
                });
                userData.userCakes.balance += Number(amount);
                mentionedUserData.userCakes.balance -= Number(amount);
                userData.userTransactions.push({
                    to: String(context.author.id),
                    from: String(user.id),
                    quantity: amount,
                    date: new Date(Date.now()),
                    received: true,
                    type: 'bet'
                });
                userData.save();
                mentionedUserData.save();

                return endCommand();

            } else if (choice !== choices[rand]) {
                context.reply({
                    content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:bet.betWithClient.lose', { user: await bot.rest.foxy.getUserDisplayName(context.author.id), result: t(`commands:bet.${choices[rand]}`), amount: amount.toLocaleString(t.lng || 'pt-BR') })),
                    flags: 64
                });
                userData.userCakes.balance -= Number(amount);
                mentionedUserData.userCakes.balance += Number(amount);
                userData.userTransactions.push({
                    to: String(user.id),
                    from: String(context.author.id),
                    quantity: amount,
                    date: new Date(Date.now()),
                    received: false,
                    type: 'bet'
                });
                userData.save();
                mentionedUserData.save();

                return endCommand();
            }
        } else {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_WOW, t('commands:bet.ask', { user: `<@!${user.id}>`, author: await bot.rest.foxy.getUserDisplayName(context.author.id), amount: amount.toLocaleString(t.lng || 'pt-BR') })),
                components: [createActionRow([createButton({
                    label: t('commands:bet.accept'),
                    style: ButtonStyles.Success,
                    customId: createCustomId(0, user.id, context.commandId, await bot.rest.foxy.getUserDisplayName(user.id), user.id, amount, choice, "accept"),
                    emoji: {
                        id: BigInt(bot.emotes.FOXY_WOW)
                    }
                }),
                createButton({
                    label: t('commands:bet.deny'),
                    style: ButtonStyles.Danger,
                    customId: createCustomId(0, user.id, context.commandId, await bot.rest.foxy.getUserDisplayName(user.id), user.id, amount, choice, "deny"),
                    emoji: {
                        id: BigInt(bot.emotes.FOXY_CRY)
                    }
                })])]
            });

        }

        return endCommand();
    }
}