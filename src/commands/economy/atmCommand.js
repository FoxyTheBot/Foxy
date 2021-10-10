const { SlashCommandBuilder } = require('@discordjs/builders');
const user = require('../../utils/DatabaseConnection');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("atm")
        .setDescription("Veja a quantia de FoxCoins que você possui")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Veja a quantia de FoxCoins de outra pessoa")),

    async execute(client, interaction) {
        const getMention = interaction.options.getUser("user") || interaction.user;

        const userData = await user.findOne({ user: getMention.id });

        if (!userData) {
            interaction.reply({ content: "Parece que você não está no meu banco de dados, execute o comando novamente!", ephemeral: true });
            return new user({
                user: getMention.id,
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

        await interaction.reply(`${getMention} tem ${userData.coins} FoxCoins!`);

    }
}