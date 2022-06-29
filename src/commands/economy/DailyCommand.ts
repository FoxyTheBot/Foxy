import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import ms from "ms";

export default class DailyCommand extends Command {
    constructor(client) {
        super(client, {
            name: "daily",
            description: "Get your daily FoxCoins",
            category: "economy",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("daily")
                .setDescription("[Economy] Get your daily FoxCoins")
        });
    }

    async execute(interaction, t): Promise<void> {
        const userData = await this.client.database.getUserByID(interaction.user.id);

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
            return interaction.reply(t('commands:daily.cooldown', { time: currentCooldown }));

        } else {
            userData.balance += amount;
            userData.lastDaily = Date.now();
            userData.save().catch(err => console.log(err));

            const money = await userData.balance;

            if (userData.premium) {
                interaction.reply(t('commands:daily.premium', { amount: amount.toString(), money: money.toString(), normalMoney: `${oldAmount}`, doubleValue: type, premiumType: t(`subscription:${userData.premiumType}`) }));
            } else {
                interaction.reply(t('commands:daily.daily', { amount: amount.toString(), money: money.toString() }));
            }
        }
    }
}