const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Faça cafuné em alguém, que fofo :3')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('O usuário que você quer fazer cafuné')
                .setRequired(true)),

    async execute(client, interaction) {
        const img = await neko.sfw.pat();
        const user = interaction.options.getUser('user');

        const patEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Que fofo -w-")
            .setDescription(`${interaction.user} **Fez cafuné** ${user}`)
            .setImage(img.url)
        await interaction.reply({ embeds: [patEmbed] });
    }
}