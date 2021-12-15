const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = class McskinCommand extends Command {
    constructor(client) {
        super(client, {
            name: "mcskin",
            category: "mine",
            data: new SlashCommandBuilder()
                .setName("mcskin")
                .setDescription("[⛏ Minecraft] Veja uma skin do Minecraft")
                .addStringOption(option => option.setName("user").setDescription("O usuário que deseja").setRequired(true))
        })
    }

    async execute(interaction) {
        const user = interaction.options.getString("user");
        if (user.length > 20) return interaction.reply("Digite no mínimo 20 caractéres");

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Skin de ${user}`)
            .setImage(`https://mc-heads.net/skin/${user}`)

        await interaction.reply({ embeds: [embed] });

    }
}