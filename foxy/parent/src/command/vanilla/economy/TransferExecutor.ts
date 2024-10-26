import { ButtonStyles, User } from "discordeno";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

export default class TransferExecutor {

    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const user = await context.getOption<User>('user', 'users');

        if (!user) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
            });

            return endCommand();
        }

        const amount = await context.getOption<number>('amount', false);

        if (isNaN(amount) || amount.toString().includes("0x") || amount < 0 || !Number.isInteger(parseFloat(amount.toString()))) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:transfer.invalidAmount'))
            });
            return endCommand();
        }

        const authorData = await bot.database.getUser(context.author.id);
        const value = Math.round(amount);

        if (user.id === context.author.id) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:pay.self'))
            });

            return endCommand();
        }

        if (value > authorData.userCakes.balance.valueOf()) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:pay.notEnough'))
            });

            return endCommand();
        }

        bot.database.createTransaction(context.author.id, {
            to: user.id,
            from: context.author.id,
            date: new Date(Date.now()),
            quantity: amount,
            received: false,
            type: 'send'
        });
        bot.database.createTransaction(user.id, {
            to: user.id,
            from: context.author.id,
            date: new Date(Date.now()),
            quantity: amount,
            received: true,
            type: 'receive'
        });

        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:pay.alert', {
                amount: value.toLocaleString(t.lng || 'pt-BR'),
                user: await bot.rest.foxy.getUserDisplayName(user.id)
            })),
            components: [createActionRow([createButton({
                label: t('commands:pay.pay'),
                style: ButtonStyles.Success,
                customId: createCustomId(0, context.author.id, context.commandId, value, user.id)
            })])]
        });

        return endCommand();
    }
}