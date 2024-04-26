import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { User } from "discordeno/transformers";
import { bot } from "../../../..";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";

export default async function BetExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const user = context.getOption<User>('user', 'users');
    const amount = context.getOption<Number>('amount', false);
    const choice = context.getOption<string>('choice', false);
    let choices = ['heads', 'tails'];
    const rand = Math.floor(Math.random() * choices.length);

    const userData = await bot.database.getUser(context.author.id);
    const mentionedUserData = await bot.database.getUser(user.id);

    if (user.id === context.author.id) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:bet.self')),
            flags: 64
        });
        return endCommand();
    }

    if (await userData.balance < amount) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:bet.not-enough', { amount: amount.toLocaleString(t.lng || 'pt-BR'), user: await bot.foxyRest.getUserDisplayName(context.author.id) })),
            flags: 64

        });

        return endCommand();
    }

    if (await mentionedUserData.balance < amount) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:bet.not-enough-mention', { amount: amount.toLocaleString(t.lng || 'pt-BR'), user: await bot.foxyRest.getUserDisplayName(user.id) })),
            flags: 64
        });

        return endCommand();
    }

    if (user.id === bot.id) {
        if (choice === choices[rand]) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:bet.betWithClient.win', { user: await bot.foxyRest.getUserDisplayName(context.author.id), result: t(`commands:bet.${choices[rand]}`), amount: amount.toLocaleString(t.lng || 'pt-BR') })),
                flags: 64
            });
            userData.balance += Number(amount);
            mentionedUserData.balance -= Number(amount);
            userData.transactions.push({
                to: context.author.id,
                from: user.id,
                quantity: amount,
                date: Date.now(),
                received: true,
                type: 'bet'
            });
            userData.save();
            mentionedUserData.save();

            return endCommand();

        } else if (choice !== choices[rand]) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:bet.betWithClient.lose', { user: await bot.foxyRest.getUserDisplayName(context.author.id), result: t(`commands:bet.${choices[rand]}`), amount: amount.toLocaleString(t.lng || 'pt-BR') })),
                flags: 64
            });
            userData.balance -= Number(amount);
            mentionedUserData.balance += Number(amount);
            userData.transactions.push({
                to: user.id,
                from: context.author.id,
                quantity: amount,
                date: Date.now(),
                received: false,
                type: 'bet'
            });
            userData.save();
            mentionedUserData.save();

            return endCommand();
        }
    } else {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_WOW, t('commands:bet.ask', { user: `<@!${user.id}>`, author: await bot.foxyRest.getUserDisplayName(context.author.id), amount: amount.toLocaleString(t.lng || 'pt-BR') })),
            components: [createActionRow([createButton({
                label: t('commands:bet.accept'),
                style: ButtonStyles.Success,
                customId: createCustomId(0, user.id, context.commandId, await bot.foxyRest.getUserDisplayName(user.id), user.id, amount, choice, "accept"),
                emoji: {
                    id: bot.emotes.FOXY_WOW
                }
            }),
            createButton({
                label: t('commands:bet.deny'),
                style: ButtonStyles.Danger,
                customId: createCustomId(0, user.id, context.commandId, await bot.foxyRest.getUserDisplayName(user.id), user.id, amount, choice, "deny"),
                emoji: {
                    id: bot.emotes.FOXY_CRY
                }
            })])]
        });

    }

    return endCommand();
}