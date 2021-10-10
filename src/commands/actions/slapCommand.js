const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('bata alguém')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('O usuário que você quer bater')
                .setRequired(true)),

    async execute(client, interaction) {
        const img = await neko.sfw.slap();
        const user = interaction.options.getUser('user');

        const slapEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Eita")
            .setDescription(`${interaction.user} **bateu** ${user}`)
            .setImage(img.url)
        await interaction.reply({ embeds: [slapEmbed] });
    }
}