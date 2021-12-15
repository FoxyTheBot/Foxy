const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = class McbodyCommand extends Command {
    constructor(client) {
        super(client, {
            name: "mcbody",
            category: "mine",
            data: new SlashCommandBuilder()
                .setName("mcbody")
                .setDescription("[⛏ Minecraft] Veja uma skin do Minecraft")
                .addStringOption(option => option.setName("user").setDescription("A conta do Minecraft que deseja olhar a skin").setRequired(true))
        })
    }

    async execute(interaction) {
        const user = interaction.options.getString("user");
        if (user.length > 20) return interaction.reply("Digite no mínimo 20 caractéres");

        const embed = new MessageEmbed()
            .setTitle(`Skin de ${user}`)
            .setImage(`https://mc-heads.net/body/${user}`)
        await interaction.reply({ embeds: [embed] });
    }
}