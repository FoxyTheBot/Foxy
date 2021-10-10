const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Abraçe alguém, que fofo :3')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('O usuário que você quer abraçar')
                .setRequired(true)),

    async execute(client, interaction) {
        const img = await neko.sfw.hug();
        const user = interaction.options.getUser('user');

        const hugEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Que fofo -w-")
            .setDescription(`${interaction.user} **Abraçou** ${user}`)
            .setImage(img.url)
        await interaction.reply({ embeds: [hugEmbed] });
    }
}