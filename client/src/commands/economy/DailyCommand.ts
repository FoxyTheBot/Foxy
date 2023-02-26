import { createCommand } from '../../structures/commands/createCommand';
import ms from 'ms';
import { bot } from '../../index';

const DailyCommand = createCommand({
    name: 'daily',
    description: '[Economia] Receba suas paws diária',
    descriptionLocalizations: {
        'en-US': '[Economy] Receive your daily paws'
    },
    category: 'economy',
    execute: async (context, endCommand, t) => {
        const userData = await bot.database.getUser(context.author.id);

        const timeout = 43200000;
        let amount = Math.floor(Math.random() * 8000);
        amount = Math.round(amount / 10) * 10;

        const daily = await userData.lastDaily;
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            const currentCooldown = ms(timeout - (Date.now() - daily));
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:daily.cooldown', { time: currentCooldown })),
                flags: 64
            });
            return endCommand();
        } else {
            userData.balance += amount;
            userData.lastDaily = Date.now();
            userData.save().catch(err => console.log(err));

            const money = await userData.balance;

            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:daily.daily', { amount: amount.toString(), money: money.toString() })),
            })
            endCommand();

        }
    }
});

export default DailyCommand;