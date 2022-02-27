import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

export default class ProfileCommand extends Command {
    constructor(client) {
        super(client, {
            name: "user",
            description: "Get user information",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("user")
                .setDescription("[🛠 Utils] Get user information")
                .addSubcommand(option => option.setName("info").setDescription("[🛠 Utils] Get some user informtion").addUserOption(
                    option => option.setName("user").setDescription("The user ID or mention").setRequired(false)
                ))
                .addSubcommand(option => option.setName("avatar").setDescription("[🛠 Utils] Get some user's avatar").addUserOption(
                    option => option.setName("user").setDescription("The user ID or mention").setRequired(false)
                ))
        });
    }

    async execute(interaction, t): Promise<void> {
        const command = interaction.options.getSubcommand();
        const user = interaction.options.getUser("user") || interaction.user;
        if(!user) return interaction.editReply(t('commands:global.noUser'));

        switch (command) {
            case "info": {
                const userEmbed = new MessageEmbed()
                    .setThumbnail(user.avatarURL({ format: "png", dynamic: true, size: 1024 }))
                    .addField(`:bookmark: ${t('commands:user.info.tag')}`, `\`${user.tag}\``, true)
                    .addField(`:date: ${t('commands:user.info.createdAt')}`, `\`${user.createdAt.toLocaleString(t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' })}\``, true)
                    .addField(`:computer: ${t('commands:user.info.userId')}`, `\`${user.id}\``, true)

                await interaction.editReply({ embeds: [userEmbed] });
                break;
            }

            case "avatar": {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel(t('commands:user.avatar.click'))
                            .setStyle("LINK")
                            .setURL(user.displayAvatarURL({ format: "png", size: 1024 }))
                    )
                const avatarEmbed = new MessageEmbed()
                    .setTitle(t('commands:user.avatar.title', { user: user.tag }))
                    .setImage(user.displayAvatarURL({ format: "png", size: 2048 }))
                    .setFooter({ text: t('commands:user.avatar.footer') })

                await interaction.editReply({ embeds: [avatarEmbed], actions: [row] });
                break;
            }
        }
    }
}