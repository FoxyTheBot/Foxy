import Command from "../../structures/BaseCommand";
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
                .setDescription("[💰 Economy] Get your daily FoxCoins")
        });
    }

    async execute(interaction, t): Promise<void> {
        const userData = await this.client.database.getUser(interaction.user.id);

        const timeout = 43200000;
        let amount = Math.floor(Math.random() * 8000);
        amount = Math.round(amount / 10) * 10;

        if (userData.premium) {
            amount = amount + 500;
        }

        const daily = await userData.lastDaily;
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            const currentCooldown = ms(timeout - (Date.now() - daily));
            return interaction.editReply(t('commands:daily.cooldown', { time: currentCooldown }));

        } else {

            userData.balance += amount;
            userData.lastDaily = Date.now();
            userData.save().catch(err => console.log(err));

            const money = await userData.balance;

            if (userData.premium) {
                interaction.editReply(`${this.client.emotes.daily} **|** ${t('commands:daily.premium', { amount: amount.toString(), money: money.toString(), normalMoney: `${amount - 500}` })}`);
            } else {
                interaction.editReply(`${this.client.emotes.daily} **|** ${t('commands:daily.daily', { amount: amount.toString(), money: money.toString() })}`)
            }
        }
    }
}