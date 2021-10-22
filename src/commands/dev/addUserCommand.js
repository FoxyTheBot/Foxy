const { SlashCommandBuilder } = require('@discordjs/builders');
const user = require('../../utils/DatabaseConnection');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adduser')
        .setDescription("Adiciona um usuário ao banco de dados")
        .addStringOption(option =>
            option.setName('user')
                .setDescription("ID do usuário a ser adicionado")
                .setRequired(true)),
    onlyDevs: true,
    async execute(client, interaction) {
        const userid = interaction.options.getString("user");
        const userData = user.findOne({ user: userid });

        if (userData) {
            return interaction.reply({ content: "Esse usuário já está no banco de dados", ephemeral: true });
        } else {
            new user({
                user: message.author.id,
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
            interaction.reply({ content: "Usuário adicionado com sucesso", ephemeral: true });
        }
    }
}