const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class StepCommand extends Command {
    constructor(client) {
        super(client, {
            name: "step",
            category: "actions",
            data: new SlashCommandBuilder()
                .setName("step")
                .setDescription("[👏 Roleplay] Pise em alguém")
                .addUserOption(option => option.setName("user").setDescription("O usuário que você quer pisar").setRequired(true))
        })
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user");

        const list = [
            'https://cdn.discordapp.com/attachments/745396328351268885/776930400990920734/6a0.gif',
            'https://cdn.discordapp.com/attachments/745396328351268885/776930405181554698/tenor_10.gif',
            'https://cdn.discordapp.com/attachments/745396328351268885/776930416966893588/tenor_8.gif',
        ]

        const rand = list[Math.floor(Math.random() * list.length)];

        const embed = new MessageEmbed()
            .setColor("BLURPLE")
            .setDescription(`${interaction.user} **pisou** em ${user}`)
            .setImage(rand)

        await interaction.reply({ embeds: [embed] });
    }
}