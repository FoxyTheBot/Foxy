const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const ms = require("ms");

module.exports = class DailyCommand extends Command {
    constructor(client) {
        super(client, {
            name: "daily",
            description: "Receba suas FoxCoins diárias",
            category: "economy",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("daily")
                .setDescription("[💵 Economy] Receba suas FoxCoins diárias")

        });

    }

    async execute(interaction) {
        const userData = await this.client.database.getUser(interaction.user.id);

        const timeout = 43200000;
        var amount = Math.floor(Math.random() * 3200);

        if (userData.premium) {
            amount = amount + 500;
        }

        const daily = await userData.lastDaily;
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            const currentCooldown = ms(timeout - (Date.now() - daily));
            return interaction.editReply(`💸 **|** Você já pegou seu daily hoje! Tente novamente em **${currentCooldown}**`);

        } else {

            userData.balance += amount;
            userData.lastDaily = Date.now();
            userData.save().catch(err => console.log(err));

            const money = await userData.balance;

            if (userData.premium) {
                interaction.editReply(`${this.client.emotes.daily} **|** Você ia ganhar ${amount - 500} FoxCoins mas graças ao seu premium você ganhou ${amount} FoxCoins e tem ${money} FoxCoins`)
            } else {
                interaction.editReply(`${this.client.emotes.daily} **|** Você coletou seu daily e ganhou ${amount} FoxCoins! Agora você possui ${money} FoxCoins`);
            }
        }
    }
}