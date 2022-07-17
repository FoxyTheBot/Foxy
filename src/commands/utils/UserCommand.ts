import Command from "../../structures/command/BaseCommand";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import convertDate from "../../structures/ClientSettings";

export default class ProfileCommand extends Command {
    constructor(client) {
        super(client, {
            name: "user",
            description: "Get user information",
            category: "utils",
            dev: false,
            data: new SlashCommandBuilder()
                .setName("user")
                .setDescription("[Utils] Get user information")
                .addSubcommand(option => option.setName("info").setDescription("[Utils] Get some user informtion").addUserOption(
                    option => option.setName("user").setDescription("The user ID or mention").setRequired(false)
                ))
                .addSubcommand(option => option.setName("avatar").setDescription("[Utils] Get some user's avatar").addUserOption(
                    option => option.setName("user").setDescription("The user ID or mention").setRequired(false)
                ))
                .addSubcommand(option => option.setName("banner").setDescription("[Utils] Get some user's banner").addUserOption(
                    option => option.setName("user").setDescription("The user ID or mention").setRequired(false)
                ))
        });
    }

    async execute(interaction, t): Promise<void> {
        const command = interaction.options.getSubcommand();
        const user = interaction.options.getUser("user") || interaction.user;
        const data = await this.client.api.users(user.id).get();

        if (data.banner) {
            var banner = data.banner.startsWith("a_") ? ".gif?size=4096" : ".png?size=4096";
            banner = `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${banner}`;
        }

        switch (command) {
            case "info": {
                const userEmbed = new EmbedBuilder()
                    .setColor(user.hexAccentColor)
                    .setThumbnail(user.avatarURL({ dynamic: true, size: 1024 }))
                    .addFields([
                        { name: `:bookmark: ${t('commands:user.info.tag')}`, value: `\`${user.tag}\`` },
                        { name: `:date: ${t('commands:user.info.createAt')}`, value: convertDate(user.createdTimestamp) },
                        { name: `:computer: ${t('commands:user.info.userId')}`, value: `\`${user.id}\`` }
                    ])
                    .setImage(banner)

                const member = interaction.guild.members.cache.get(user.id);
                if (member) {
                    const memberRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(t('commands:user.member.permissions.button'))
                                .setCustomId("permissions")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:sus:985332743464439809>"),
                            new ButtonBuilder()
                                .setLabel(t('commands:user.info.avatar'))
                                .setCustomId("avatar")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:ShiroFoxy:934469525997518848>")
                        )

                    const memberEmbed = new EmbedBuilder()
                        .setColor(user.hexAccentColor)
                        .setTitle(t('commands:user.member.title', { user: user.username }))
                        .setThumbnail(user.avatarURL({ dynamic: true, size: 1024 }))
                        .addFields(
                            { name: t('commands:user.member.joinedAt'), value: convertDate(member.joinedTimestamp) },
                            { name: t('commands:user.member.nickname'), value: member.displayName },
                        )
                    if (member.roles.highest.name !== "@everyone") {
                        memberEmbed.addFields([
                            {
                                name: `${t('commands:user.member.highestRole')}`, value: `${member.roles.highest}`
                            },
                        ])
                    }
                    if (member.premiumSinceTimestamp) {
                        memberEmbed.addFields([
                            { name: `${t('commands:user.member.premiumSince')}`, value: convertDate(member.premiumSinceTimestamp) },
                        ])
                    }
                    interaction.reply({ embeds: [userEmbed, memberEmbed], components: [memberRow] });
                } else {
                    const avatarRow = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(t('commands:user.info.avatar'))
                                .setCustomId("avatar")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:ShiroFoxy:934469525997518848>")
                        )
                    interaction.reply({ embeds: [userEmbed], components: [avatarRow] });
                }

                const filter = i => i.customId === 'avatar' && i.user.id === interaction.user.id && i.message.id === interaction.message.id;
                const avatarCollector = interaction.channel.createMessageComponentCollector(filter, { max: 1, time: 5000 });

                avatarCollector.on('collect', async i => {
                    if (i.customId === 'avatar') {
                        if (await this.client.ctx.getContext(interaction, i, 1)) {
                            if (i.user.id !== interaction.user.id) {
                                i.deferUpdate();
                                return i.user.send({ content: t('commands:foxyGlobal.noPermission', { user: `<@${interaction.user.id}>` }) });
                            }
                            const avatarEmbed = new EmbedBuilder()
                                .setTitle(t('commands:user.avatar.title', { user: user.username }))
                                .setImage(user.avatarURL({ dynamic: true, size: 1024 }))
                            const row = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(t('commands:user.avatar.click'))
                                        .setStyle(ButtonStyle.Link)
                                        .setURL(user.avatarURL({ dynamic: true, size: 1024 })),

                                )
                            await interaction.followUp({ embeds: [avatarEmbed], ephemeral: true, components: [row] });
                            i.deferUpdate();
                            avatarCollector.stop();
                        }
                    } else if (i.customId === 'permissions') {
                        if (await this.client.ctx.getContext(interaction, i, 1)) {
                            if (i.user.id !== interaction.user.id) {
                                i.deferUpdate();
                                return i.user.send({ content: t('commands:foxyGlobal.noPermission', { user: `<@${interaction.user.id}>` }) });
                            }
                            const permissions = member.permissions.toArray();
                            const embed = new EmbedBuilder()
                                .setTitle(t('commands:user.member.permissions.title', { user: user.username }))
                                .addFields([
                                    { name: t('commands:user.member.role'), value: `${member._roles.map(r => `<@&${r}>`).join(", ") || t('commands:user.member.noRoles')}` },
                                    { name: t('commands:user.member.permissions.title', { user: user.username }), value: `${permissions.map(p => `\`${t(`permissions:${p}`)}\``).join(", ") || t('commands:user.member.noPermissions')}` }
                                ])
                            interaction.followUp({ embeds: [embed], ephemeral: true });
                            i.deferUpdate();
                            avatarCollector.stop();
                        }
                    }
                });
                break;
            }

            case "avatar": {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(t('commands:user.avatar.click'))
                            .setStyle(ButtonStyle.Link)
                            .setURL(user.avatarURL({ dynamic: true, size: 1024 })),

                    )
                const avatarEmbed = new EmbedBuilder()
                    .setTitle(t('commands:user.avatar.title', { user: user.username }))
                    .setImage(user.avatarURL({ dynamic: true, size: 1024 }))

                await interaction.reply({ embeds: [avatarEmbed], components: [row] });
                break;
            }

            case "banner": {
                if (!data.banner) return interaction.reply(t('commands:user.banner.noBanner'));

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(t('commands:user.banner.click'))
                            .setStyle(ButtonStyle.Link)
                            .setURL(banner),
                    )
                if (!banner) return interaction.reply(t('commands:user.banner.noBanner'));
                const bannerEmbed = new EmbedBuilder()
                    .setTitle(t('commands:user.banner.title', { user: user.username }))
                    .setImage(banner)

                await interaction.reply({ embeds: [bannerEmbed], components: [row] });
            }
        }
    }
}