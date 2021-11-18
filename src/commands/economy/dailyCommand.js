const { SlashCommandBuilder } = require('@discordjs/builders');
const user = require('../../utils/DatabaseConnection');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Ganhe seus FoxCoins diários'),

    async execute(client, interaction) {
        const userData = await user.findOne({ user: interaction.user.id });

        if (!userData) {
            interaction.reply({ content: "Parece que você não está no meu banco de dados, execute o comando novamente!", ephemeral: true });
            return new user({
                user: interaction.member.id,
                coins: 0,
                lastDaily: null,
                reps: 0,
                lastRep: null,
                backgrounds: ['default.png'],
                background: 'default.png',
                aboutme: null,
                marry: null,
                premium: false,
            }).save().catch(err => console.log(err));
        }


        const timeout = 43200000;
        var amount = 40000;

        if (userData.premium) {
            amount = amount + 4628;
        }

        const daily = await userData.lastDaily;
        if (daily !== null && timeout - (Date.now() - daily) > 0) {
            const time = ms(timeout - (Date.now() - daily));

            return interaction.reply(`💸 **|** Você já pegou seu daily hoje! Tente novamente em **${time.hours}h ${time.minutes}m ${time.seconds}s**`);

        } else {

            userData.coins = + amount;
            userData.lastDaily = Date.now();
            userData.save().catch(err => console.log(err));

            const money = await userData.coins;

            interaction.reply(`💵 **|** Você coletou seu daily e ganhou ${amount} FoxCoins! Agora você possui ${money} FoxCoins`);
        }
    }
}
