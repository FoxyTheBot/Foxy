const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stare')
        .setDescription('Encare alguém, que sus -.-')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('O usuário que você quer espiar')
                .setRequired(true)),

    async execute(client, interaction) {
        const user = interaction.options.getUser('user');

        const list = [
            'https://media1.tenor.com/images/ad4684854b2b82d065aa5844033a79d1/tenor.gif?itemid=12003923',
            'https://media1.tenor.com/images/d7c762fc8149db58393f3d31fbddaad1/tenor.gif?itemid=17156744',
            'https://media1.tenor.com/images/128ce549554ac7da234e4ed30478b981/tenor.gif?itemid=16691647',
            'https://media1.tenor.com/images/e80668007c424cb3a972e154e2c4afb8/tenor.gif?itemid=17198388',
            'https://media.tenor.com/images/4e879a98b2c39e33a4fc5bb9957a44de/tenor.gif',
            'https://media1.tenor.com/images/6db16173c29293e2c0f63db13601a85d/tenor.gif?itemid=15313333',
        ];

        const rand = list[Math.floor(Math.random() * list.length)];
        const user = interaction.options.getUser('user');

        const attackEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Que sus")
            .setDescription(`${interaction.user} **Encarou** ${user.username}`)
            .setImage(rand)
        await interaction.reply({ embeds: [attackEmbed] });
    }
}