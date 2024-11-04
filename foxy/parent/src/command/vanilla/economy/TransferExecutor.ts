import { ButtonStyles, User } from "discordeno";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { bot } from "../../../FoxyLauncher";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

export default class TransferExecutor {

    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        if (context.message) return;
        const user = await context.getOption<User>('user', 'users');

        if (!user) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
            });

            return endCommand();
        }

        const amount = context.interaction ? await context.getOption<number>('amount', false) : context.getMessage(2);

        const amountAsNumber = Number(amount);

        if (
            isNaN(amountAsNumber) ||                 
            /0x/i.test(amount.toString()) ||       
            parseFloat(amount.toString()) <= 0 ||       
            !Number.isInteger(parseFloat(amount.toString()))
        ) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:pay.invalidAmount'))
            });
            return endCommand();
        }
        
        const authorData = await bot.database.getUser(context.author.id);
        const value = Math.round(amountAsNumber);

        if (user.id === context.author.id) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:pay.self'))
            });

            return endCommand();
        }

        if (value > authorData.userCakes.balance.valueOf()) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:pay.notEnough'))
            });

            return endCommand();
        }

        bot.database.createTransaction(context.author.id, {
            to: user.id.toString(),
            from: context.author.id.toString(),
            date: new Date(Date.now()),
            quantity: amountAsNumber,
            received: false,
            type: 'send'
        });
        bot.database.createTransaction(user.id, {
            to: user.id.toString(),
            from: context.author.id.toString(),
            date: new Date(Date.now()),
            quantity: amountAsNumber,
            received: true,
            type: 'receive'
        });

        context.reply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:pay.alert', {
                amount: value.toLocaleString(t.lng || 'pt-BR'),
                user: await bot.rest.foxy.getUserDisplayName(user.id)
            })),
            components: [createActionRow([createButton({
                label: t('commands:pay.pay'),
                style: ButtonStyles.Success,
                customId: createCustomId(0, context.author.id, context.commandId, value, user.id),
                emoji: {
                    id: BigInt(bot.emotes.FOXY_DAILY)
                }
            })])]
        });

        return endCommand();
    }
}