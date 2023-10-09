import { createCommand } from '../../structures/commands/createCommand';
import ms from 'ms';
import { bot } from '../../index';
import { MessageFlags } from '../../utils/discord/Message';

const DailyCommand = createCommand({
    name: 'daily',
    description: '[Economy] Receive your daily cakes',
    descriptionLocalizations: {
        'pt-BR': '[Economia] Receba seus cakes diários'
    },
    category: 'economy',
    execute: async (context, endCommand, t) => {
        const userData = await bot.database.getUser(context.author.id);

        const timeout = 43200000;
        let amount = Math.floor(Math.random() * 8000);
        amount = Math.round(amount / 10) * 10;

        const daily = await userData.lastDaily;
        let multiplier;
        let oldquantity;
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            const currentCooldown = ms(timeout - (Date.now() - daily));
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:daily.cooldown', { time: currentCooldown })),
                flags: 64
            });
            return endCommand();
        } else {
            if (amount < 1000) amount = 1000;

            switch (await userData.premiumType) {
                case 1: {
                    oldquantity = amount;
                    amount = amount * 1.25;
                    multiplier = '1.25x'
                    break;
                }

                case 2: {
                    oldquantity = amount;
                    amount = amount * 1.5;
                    multiplier = '1.5x'
                    break;
                }

                case 3: {
                    oldquantity = amount;
                    amount = amount * 2;
                    multiplier = '2x'
                    break;
                }
            }

            userData.balance += amount;
            userData.lastDaily = Date.now();
            userData.transactions.push({
                to: context.author.id,
                from: null,
                quantity: amount,
                date: Date.now(),
                received: true,
                type: 'daily'
            });
            userData.save().catch(err => console.log(err));

            const money = await userData.balance;

            switch (await userData.premium) {
                case true: {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:daily.dailyPremium', { amount: amount.toLocaleString(t.lng || 'pt-BR'), money: money.toLocaleString(t.lng || 'pt-BR'), old: oldquantity.toLocaleString(t.lng || 'pt-BR') })) + context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:daily.dailyAlert')),
                        flags: MessageFlags.EPHEMERAL
                    });
                    break;
                }

                case false: {
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
});

export default DailyCommand;