import Command from "../../structures/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";

export default class ServerCommand extends Command {
    constructor(client) {
        super(client, {
            name: "server",
            description: "Get information about the server",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("server")
                .setDescription("[🛠 Utils] Get information about the server")
                .addSubcommand(option => option.setName("info").setDescription("[🛠 Utils] Get information about a Discord Server").addStringOption(
                    option => option.setName("id").setDescription("ID do servidor.").setRequired(false)))
                .addSubcommand(option => option.setName("icon").setDescription("[🛠 Utils] Get the server's icon").addStringOption(
                    option => option.setName("id").setDescription("ID do servidor.").setRequired(false)))
        });
    }

    async execute(interaction, t) {
        const subcommand = interaction.options.getSubcommand();

        var server = interaction.guild;
        if (interaction.options.getString("id")) {
            server = await this.client.guilds.cache.get(interaction.options.getString("id"));
            if (!server) return interaction.editReply(`${this.client.emotes.error} **|** ${t("commands:server.notFound"), { guildId: interaction.options.getString("id") }}`);
        }
        const owner = await this.client.users.fetch(server.ownerId);

        let partner = server.partnered;

        if (partner === false) partner = t("commands:server.no");
        else partner = t("commands:server.yes");

        let afk = server.afkChannel;
        if (!afk) afk = t("commands:server.no");

        switch (subcommand) {
            case "info": {
                const embed = new MessageEmbed()
                    .setTitle(server.name)
                    .setThumbnail(server.iconURL())
                    .addFields(
                        { name: `:crown: ${t('commands:server.owner')}`, value: `\`${owner.tag}\``, inline: true },
                        { name: `:computer: ID`, value: `\`${server.id}\``, inline: true },
                        { name: `:calendar: ${t('commands:server.createdAt')}`, value: `\`${server.createdAt.toLocaleString(t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' })}\``, inline: true },
                        { name: `:star: ${t('commands:server.clientJoin')}`, value: `\`${server.joinedAt.toLocaleString(t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' })}\`` || "Não estou no servidor :(", inline: true },
                        { name: `:speech_balloon: ${t('commands:server.channels')}`, value: `\`${server.channels.cache.size}\``, inline: true },
                        { name: `<a:impulso:756507043854024784> ${t('commands:server.premium')}:`, value: server.premiumSubscriptionCount.toString(), inline: true },
                        { name: `:busts_in_silhouette: ${t('commands:server.memberCount')}`, value: `\`${server.memberCount}\``, inline: true },
                        { name: `<a:sleeepy:803647820867174421> ${t('commands:server.partner')}`, value: `\`${partner}\``, inline: true },
                        { name: `<a:sleeepy:803647820867174421> ${t('commands:server.afk')}`, value: `${afk}`, inline: true },
                        { name: ':computer: Shard ID', value: `${server.shardId + 1}`, inline: true },
                    )

                await interaction.editReply({ embeds: [embed] });
                break;
            }

            case "icon": {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel(t("commands:server.click"))
                            .setStyle("LINK")
                            .setURL(server.iconURL({ format: "png", size: 2048 }))
                    )
                const embed = new MessageEmbed()
                    .setTitle(server.name)
                    .setImage(server.iconURL({ format: "png", size: 2048 }))

                await interaction.editReply({ embeds: [embed], components: [row] });
                break;
            }
        }
    }
}