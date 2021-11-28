const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = class UserinfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "userinfo",
            description: "Mostra informações de um usuário",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
            .setName("userinfo")
            .setDescription("Mostra informações de um usuário")
            .addUserOption(option => option.setName("user").setDescription("O usuário que você deseja ver as informações").setRequired(false))
        })
    }

    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;

        const userEmbed = new MessageEmbed()
        .setTitle(user.username)
        .setThumbnail(user.displayAvatarURL())
        .addField(":bookmark: Discord User", `\`${user.tag}\``, true)
        .addField(":date: Conta criada", `\`${user.createdAt.toLocaleString()}\``, true)
        .addField(":computer: ID do Usuário", `\`${user.id}\``, true)

        await interaction.reply({ embeds: [userEmbed] });
    }
}