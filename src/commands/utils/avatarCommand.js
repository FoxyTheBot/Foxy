const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Veja o avatar de algum usuário do Discord')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Mencione algum usuário')),

    async execute(client, interaction) {
        const user = await interaction.options.getUser('user') || interaction.user;

        const avatar = user.displayAvatarURL({ dynamic: true, format: 'png', size: 1024 });
        const embed = new MessageEmbed()
            .setColor('#4cd8b2')
            .setTitle(`Avatar de ${user.username}`)
            .setDescription(`Clique [aqui](${avatar}) para baixar o avatar`)
            .setImage(avatar);
        interaction.reply({ embeds: [embed] });
    }
}