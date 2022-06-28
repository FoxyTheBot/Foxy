import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import convertDate from "../../structures/ClientSettings";

export default class RoleInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "role",
            description: "Get info about a role",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("role")
                .setDescription("[Utils] Get info about a role")
                .addSubcommand(command => command.setName("info").setDescription("Get info about a role").addRoleOption(option => option.setName("role").setDescription("The role to get info about").setRequired(true)))
        });
    }

    async execute(interaction, t) {
        const role = interaction.options.getRole("role");
        const rolePermissions = role.permissions.toArray();

        const roleEmbed = new MessageEmbed()
            .setColor(role.hexColor)
            .setTitle(role.name)
            .setDescription(t("commands:role.description") + "\n\n" + rolePermissions.map(p => `\`${t(`permissions:${p}`)}\``).join(", ") || t('commands:role.noPermissions'))
            .addFields(
                { name: t("commands:role.id"), value: `\`${role.id}\`` },
                { name: t("commands:role.color"), value: `\`${role.hexColor}\`` },
                { name: t("commands:role.createdAt"), value: convertDate(role.createdTimestamp) },
                { name: t("commands:role.roleMention"), value: `\`<@&${role.id}>\` / <@&${role.id}>` }
            )

        if (role.icon) {
            roleEmbed.setThumbnail(role.iconURL({ dynamic: true, size: 1024 }));
        }
        await interaction.reply({ embeds: [roleEmbed] });
    }
}