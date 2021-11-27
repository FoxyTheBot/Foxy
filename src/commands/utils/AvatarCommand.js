const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            description: "Mostra o avatar de um usuário",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("avatar")
                .setDescription("Mostra o avatar de um usuário")
                .addUserOption(option => option.setName("user").setDescription("Mencione um usuário").setRequired(false))
        })
    }

    async execute(interaction) {
        const user = await interaction.options.getUser("user") || interaction.user;
        const avatarEmbed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(`Avatar de ${user.username}`)
            .setImage(user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }))
            .setFooter("Avatar lindo! :3")
        interaction.reply({ embeds: [avatarEmbed] });
    }
}