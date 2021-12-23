const Command = require("../../structures/Command");
const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = class McheadCommand extends Command {
    constructor(client) {
        super(client, {
            name: "mchead",
            category: "mine",
            data: new SlashCommandBuilder()
                .setName("mchead")
                .setDescription("[⛏ Minecraft] Veja a cabeça de um player do Minecraft")
                .addStringOption(option => option.setName("user").setDescription("O usuário que deseja").setRequired(true))
        });
    }

    async execute(interaction) {
        const user = interaction.options.getString("user");
        if (user.length > 20) return interaction.reply("Digite no mínimo 20 caractéres");

        const embed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(`Skin de ${user}`)
            .setImage(`https://mc-heads.net/head/${user}`)

        await interaction.reply({ embeds: [embed] });
    }
}