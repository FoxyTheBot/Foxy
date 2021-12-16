const Command = require("../../structures/Command");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = class UserCommand extends Command {
    constructor(client) {
        super(client, {
            name: "user",
            description: "View information about a user.",
            data: new SlashCommandBuilder()
                .setName("user")
                .setDescription("[🛠 Utils] Veja informação de um usuário.")
                .addSubcommand(option => option.setName("info").setDescription("[🛠 Utils] Veja informação de um usuário.").addUserOption(
                    option => option.setName("user").setDescription("O usuário que você deseja ver a informação").setRequired(false)
                ))
                .addSubcommand(option => option.setName("avatar").setDescription("[🛠 Utils] Veja o avatar de um usuário.").addUserOption(
                    option => option.setName("user").setDescription("O usuário que você deseja ver a informação").setRequired(false)
                ))
        });
    }

    async execute(interaction) {
        const command = interaction.options.getSubcommand();
        const user = interaction.options.getUser("user") || interaction.user;
        switch (command) {
            case "info": {
                const userEmbed = new MessageEmbed()
                    .setTitle(user.username)
                    .setThumbnail(user.displayAvatarURL())
                    .addField(":bookmark: Discord User", `\`${user.tag}\``, true)
                    .addField(":date: Conta criada", `\`${user.createdAt.toLocaleString()}\``, true)
                    .addField(":computer: ID do Usuário", `\`${user.id}\``, true)

                await interaction.reply({ embeds: [userEmbed] });
                break;
            }

            case "avatar": {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel("Abrir avatar no navegador")
                            .setStyle("LINK")
                            .setURL(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=2048`)
                    )
                const avatarEmbed = new MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle(`Avatar de ${user.username}`)
                    .setImage(user.displayAvatarURL({ dynamic: true, format: "png", size: 2048 }))
                    .setFooter("Avatar lindo! :3")
                interaction.reply({ embeds: [avatarEmbed], components: [row] });
                break;
            }
        }
    }
}