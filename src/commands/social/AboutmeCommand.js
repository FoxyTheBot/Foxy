const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class AboutmeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'aboutme',
            description: "Altera seu sobre mim",
            category: "social",
            dev: false,
            data: new SlashCommandBuilder()
                .setName('aboutme')
                .setDescription('Altera seu sobre mim')
                .addStringOption(option => option.setName('aboutme').setDescription('Nova descrição').setRequired(true))
        })
    }

    async execute(interaction) {
        const aboutme = await interaction.options.getString('aboutme');
        const userData = await this.client.database.getDocument(interaction.user.id);

        userData.aboutme = aboutme;
        userData.save();

        interaction.reply(`Seu Sobre mim foi alterado para \`${aboutme}\``);
    }
}