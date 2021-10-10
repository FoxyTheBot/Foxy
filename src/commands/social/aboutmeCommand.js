const { SlashCommandBuilder } = require('@discordjs/builders');
const user = require('../../utils/DatabaseConnection');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("aboutme")
        .setDescription("Troque sua mensagem no sobre mim")
        .addStringOption(option =>
            option.setName("mensagem")
                .setDescription("Digite sua mensagem do aboutme")
                .setRequired(true)),

    async execute(client, interaction) {
        const aboutme = interaction.options.getString("mensagem");
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

        userData.aboutme = aboutme;
        userData.save().catch(err => console.log(err));

        interaction.reply({ content: `Sua mensagem de perfil foi definida para ${aboutme}`, ephemeral: true });

    }
}
