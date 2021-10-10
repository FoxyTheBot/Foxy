const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Beije alguém, que fofo :3')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('O usuário que você quer beijar')
                .setRequired(true)),

    async execute(client, interaction) {
        const img = await neko.sfw.kiss();
        const user = interaction.options.getUser('user');

        const kissEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle("Que fofo -w-")
            .setDescription(`${interaction.user} **Beijou** ${user}`)
            .setImage(img.url)
        await interaction.reply({ embeds: [kissEmbed] });
    }
}