const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attack')
        .setDescription('Ataque alguém, só não mate!')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('O usuário que você quer atacar')
                .setRequired(true)),

    async execute(client, interaction) {
        const list = [
            'https://cdn.zerotwo.dev/PUNCH/38a3ab62-17f4-4682-873a-121e886d7bce.gif',
            'https://cdn.zerotwo.dev/PUNCH/84c082d0-24e7-491e-bcfc-be03ee46125c.gif',
            'https://cdn.zerotwo.dev/PUNCH/3a5b2598-a973-4e6f-a1d0-9b87a2c35a18.gif',
        ];
        const rand = list[Math.floor(Math.random() * list.length)];
        const user = interaction.options.getUser('user');

        const attackEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`${interaction.user} **Atacou** ${user}`)
            .setImage(rand)
        await interaction.reply({ embeds: [attackEmbed] });
    }
}