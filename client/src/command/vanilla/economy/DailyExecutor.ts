import ms from 'ms';
import { bot } from '../../../FoxyLauncher';
import { MessageFlags } from '../../../utils/discord/Message';
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { logger } from '../../../utils/logger';

export default class DailyExecutor {

    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        try {
            context.sendDefer(true);
            const userData = await bot.database.getUser(context.author.id);
            const timeout = 43200000; // 12 hours in milliseconds
            const currentTime = Date.now();
            const lastDaily = Number(userData.userCakes.lastDaily) || 0;

            if (lastDaily && timeout > (currentTime - lastDaily)) {
                const remainingTime = ms(timeout - (currentTime - lastDaily));
                return context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:daily.cooldown', {
                        time: remainingTime
                    })),
                    flags: MessageFlags.EPHEMERAL
                })
            }

            let amount = Math.max(Math.floor(Math.random() * 8000) / 10 * 10, 1000);
            const premiumType = userData.userPremium.premiumType ?? 0;
            const multipliers = {
                '1': 1.25,
                '2': 1.5,
                '3': 2
            };

            const multiplier = multipliers[premiumType.toString()] || 1;
            amount *= multiplier;

            userData.userCakes.balance += amount;
            userData.userCakes.lastDaily = new Date(currentTime);
            await bot.database.createTransaction(context.author.id, {
                to: context.author.id,
                from: null,
                quantity: amount,
                date: new Date(currentTime),
                received: true,
                type: 'daily'
            });

            await userData.save();

            const balanceStr = userData.userCakes.balance.toLocaleString(t.lng || 'pt-BR');
            const amountStr = amount.toLocaleString(t.lng || 'pt-BR');
            const oldAmountStr = (userData.userCakes.balance - amount).toLocaleString(t.lng || 'pt-BR');
            const replyContent = userData.userPremium.premium
                ? context.makeReply(bot.emotes.FOXY_DAILY, t('commands:daily.dailyPremium', { boost: `${multiplier}x`, amount: amountStr, money: balanceStr, old: oldAmountStr })) + "\n" + context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:daily.dailyAlert'))
                : context.makeReply(bot.emotes.FOXY_DAILY, t('commands:daily.daily', { amount: amountStr, money: balanceStr })) + context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:daily.dailyAlert'));

            context.sendReply({
                content: replyContent,
                flags: MessageFlags.EPHEMERAL
            })
        } catch (err) {
            logger.error(err);
        } finally {
            endCommand();
        }
    }
}