const { SlashCommandBuilder } = require('@discordjs/builders');
const user = require('../../utils/DatabaseConnection');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setpremium')
        .setDescription("Define um usuário como premium, ou não")
        .addStringOption(option =>
            option.setName('user')
                .setDescription("Usuário que será definido como premium")
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName("premium")
                .setDescription("Define se o usuário será ou não premium")
                .setRequired(true)),
    onlyDevs: true,
    async execute(client, interaction) {
        const userData = await user.findOne({ user: interaction.options.getString('user') });

        if (!userData) return interaction.reply("Usuário não encontrado");

        userData.premium = interaction.options.getBoolean('premium');
        await userData.save();
        await interaction.reply(`${userData.user} foi definido como ${userData.premium}`);
    }
}
