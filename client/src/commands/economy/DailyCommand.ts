import { createCommand } from '../../structures/commands/createCommand';
import ms from 'ms';
import { bot } from '../../index';

const DailyCommand = createCommand({
name: 'daily',
    description: '[💵] Receba suas paws diária',
    descriptionLocalizations: {
        'en-US': '[💵] Receive your daily paws'
    },
    category: 'economy',
    execute: async (ctx, endCommand, t) => {
        const userData = await bot.database.getUser(ctx.author.id);

        const timeout = 43200000;
        let amount = Math.floor(Math.random() * 8000);
        amount = Math.round(amount / 10) * 10;

        if (userData.premium) {
            var oldAmount = amount;
            var type;
            switch (userData.premiumType) {
                case "INFINITY_ESSENTIALS": {
                    amount = amount * 1.25;
                    type = "1.25x";
                    break;
                }

                case "INFINITY_PRO": {
                    amount = amount * 1.5;
                    type = "1.5x";
                    break;
                }

                case "INFINITY_TURBO": {
                    amount = amount * 2;
                    type = "2x";
                    break;
                }

                case "VETERAN": {
                    amount = amount * 2;
                    type = "2x";
                    break;
                }
            }
        }

        const daily = await userData.lastDaily;
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            const currentCooldown = ms(timeout - (Date.now() - daily));
            ctx.foxyReply({
                content: ctx.makeReply(bot.emotes.error, t('commands:daily.cooldown', { time: currentCooldown })),
                flags: 64
            });
            return endCommand();
        } else {
            userData.balance += amount;
            userData.lastDaily = Date.now();
            userData.save().catch(err => console.log(err));

            const money = await userData.balance;

            if (userData.premium) {
                ctx.foxyReply({
                    content: ctx.makeReply(bot.emotes.daily, t('commands:daily.premium', { amount: amount.toString(), money: money.toString(), normalMoney: `${oldAmount}`, doubleValue: type, premiumType: t(`subscription:${userData.premiumType}`) })),
                    flags: 64
                });
                endCommand();
            } else {
                ctx.foxyReply({
                    content: ctx.makeReply(bot.emotes.daily, t('commands:daily.daily', { amount: amount.toString(), money: money.toString() })),
                    flags: 64
                })
                endCommand();
            }
        }
    }
});

export default DailyCommand;