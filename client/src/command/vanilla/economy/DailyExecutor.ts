import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import ms from 'ms';
import { bot } from '../../../index';
import { MessageFlags } from '../../../utils/discord/Message';

export default async function DailyExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const userData = await bot.database.getUser(context.author.id);

    const timeout = 43200000;
    let amount = Math.floor(Math.random() * 8000);
    amount = Math.round(amount / 10) * 10;

    const daily = await userData.userCakes.lastDaily;
    const premiumType = await userData.userPremium.premiumType ?? 0;
    var multiplier;
    var oldquantity = amount;
    if (daily !== null && timeout - (Date.now() - Number(daily)) > 0) {
        const currentCooldown = ms(timeout - (Date.now() - Number(daily)));
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:daily.cooldown', { time: currentCooldown })),
            flags: 64
        });
        return endCommand();
    } else {
        if (amount < 1000) amount = 1000;

        switch (await premiumType.toString() ?? '0') {
            case "1": {
                amount = amount * 1.25;
                multiplier = '1.25x'
                break;
            }

            case "2": {
                amount = amount * 1.5;
                multiplier = '1.5x'
                break;
            }

            case "3": {
                amount = amount * 2;
                multiplier = '2x'
                break;
            }
        }

        userData.userCakes.balance += amount;
        userData.userCakes.lastDaily = new Date(Date.now());
        userData.userTransactions.push({
            to: String(context.author.id),
            from: null,
            quantity: amount,
            date: new Date(Date.now()),
            received: true,
            type: 'daily'
        });
        userData.save().catch(err => console.log(err));

        const money = await userData.userCakes.balance;

        switch (await userData.userPremium.premium) {
            case true: {
                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:daily.dailyPremium', { boost: multiplier, amount: amount.toLocaleString(t.lng || 'pt-BR'), money: money.toLocaleString(t.lng || 'pt-BR'), old: oldquantity.toLocaleString(t.lng || 'pt-BR') })) + "\n" + context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:daily.dailyAlert')),
                    flags: MessageFlags.EPHEMERAL
                });
                break;
            }

            default: {
                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:daily.daily', { amount: amount.toLocaleString(t.lng || 'pt-BR'), money: money.toLocaleString(t.lng || 'pt-BR') })) + context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:daily.dailyAlert')),
                    flags: MessageFlags.EPHEMERAL
                });
                break;
            }
        }
        endCommand();

    }
}