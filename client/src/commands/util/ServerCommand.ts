import { createEmbed } from "../../utils/discord/Embed";
import { bot } from "../..";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { ButtonStyles, ChannelTypes } from "discordeno/types";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { createCommand } from "../../structures/commands/createCommand";
import { MessageFlags } from "../../utils/discord/Message";

const ServerCommand = createCommand({
    name: "server",
    description: "[Utils] Show the information about a server",
    descriptionLocalizations: {
        "pt-BR": "[Utilitários] Mostra as informações de um servidor"
    },
    category: 'util',
    options: [{
        name: "info",
        description: "[Utils] Show the information about a server",
        descriptionLocalizations: {
            "pt-BR": "[Utilitários] Mostra as informações de um servidor"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "server_id",
            nameLocalizations: {
                "pt-BR": "id_do_servidor"
            },
            description: "The ID of the server you want to see the information",
            descriptionLocalizations: {
                "pt-BR": "O ID do servidor que você deseja ver as informações"
            },
            type: ApplicationCommandOptionTypes.String,
            required: false
        }]
    },
    {
        name: "icon",
        description: "[Utils] Show the icon of a server",
        descriptionLocalizations: {
            "pt-BR": "[Utilitários] Mostra o ícone de um servidor"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "server_id",
            nameLocalizations: {
                "pt-BR": "id_do_servidor"
            },
            description: "The ID of the server you want to see the icon",
            descriptionLocalizations: {
                "pt-BR": "O ID do servidor que você deseja ver o ícone"
            },
            type: ApplicationCommandOptionTypes.String,
            required: false
        }]
    },
    {
        name: "banner",
        description: "[Utils] Show the banner of a server",
        descriptionLocalizations: {
            "pt-BR": "[Utilitários] Mostra o banner de um servidor"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "server_id",
            nameLocalizations: {
                "pt-BR": "id_do_servidor"
            },
            description: "The ID of the server you want to see the banner",
            descriptionLocalizations: {
                "pt-BR": "O ID do servidor que você deseja ver o banner"
            },
            type: ApplicationCommandOptionTypes.String,
        }]
    }],
    execute: async (context, endCommand, t) => {
        const subCommand = context.getSubCommand();
        const serverId = context.getOption<string>('server_id', false) ?? context.guildId;
        const guildInfo = await bot.helpers.getGuild(serverId).catch(() => null);

        if (!guildInfo) {
            return context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.guild_not_found')),
                flags: MessageFlags.EPHEMERAL
            });
        }
        switch (subCommand) {
            case "info": {
                context.sendDefer();
                const channels = await bot.helpers.getChannels(serverId);
                const roles = await bot.helpers.getRoles(serverId);
                const boosts = await guildInfo.premiumSubscriptionCount;
                const emojis = await guildInfo.emojis.size;

                var textChannelString;
                var voiceChannelString;
                var rolesString;
                var boostString;
                var emojiString;


                if (channels) {
                    if (channels.filter(c => c.type === ChannelTypes.GuildText).size > 1) {
                        textChannelString = t('commands:server.info.fields.channels_suffix', { channels: channels.filter(c => c.type === ChannelTypes.GuildText).size.toString() });
                    } else if (channels.filter(c => c.type === ChannelTypes.GuildText).size === 1) {
                        textChannelString = t('commands:server.info.fields.single_channel_suffix', { channels: channels.filter(c => c.type === ChannelTypes.GuildText).size.toString() });
                    } else {
                        textChannelString = t('commands:server.info.fields.no_channels_suffix');
                    }

                    if (channels.filter(c => c.type === ChannelTypes.GuildVoice).size > 1) {
                        voiceChannelString = t('commands:server.info.fields.channels_suffix', { channels: channels.filter(c => c.type === ChannelTypes.GuildVoice).size.toString() });
                    } else if (channels.filter(c => c.type === ChannelTypes.GuildVoice).size === 1) {
                        voiceChannelString = t('commands:server.info.fields.single_channel_suffix', { channels: channels.filter(c => c.type === ChannelTypes.GuildVoice).size.toString() });
                    }
                } else {
                    voiceChannelString = t('commands:server.info.fields.no_channels_suffix');
                }

                if (roles) {
                    if (roles.size > 1) {
                        rolesString = t('commands:server.info.fields.roles_suffix', { roles: roles.size.toString() });
                    } else if (roles.size === 1) {
                        rolesString = t('commands:server.info.fields.single_role_suffix', { roles: roles.size.toString() });
                    }
                } else {
                    rolesString = t('commands:server.info.fields.no_roles_suffix');
                }

                if (boosts) {
                    if (boosts > 1) {
                        boostString = t('commands:server.info.fields.boosts_suffix', { boosts: boosts.toString() });
                    } else if (boosts === 1) {
                        boostString = t('commands:server.info.fields.single_boost_suffix', { boosts: boosts.toString() });
                    }
                } else {
                    boostString = t('commands:server.info.fields.no_boosts_suffix');
                }

                if (emojis) {
                    if (emojis > 1) {
                        emojiString = t('commands:server.info.fields.emojis_suffix', { emojis: emojis.toString() });
                    } else if (emojis === 1) {
                        emojiString = t('commands:server.info.fields.single_emoji_suffix', { emojis: emojis.toString() });
                    }
                } else {
                    emojiString = t('commands:server.info.fields.no_emojis_suffix');
                }

                const embed = createEmbed({
                    title: t('commands:server.info.title', { server: guildInfo.name }),
                    fields: [{
                        name: "ID",
                        value: `\`${guildInfo.id.toString()}\``,
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.owner'),
                        value: `\`${await bot.foxyRest.getUserDisplayName(guildInfo.ownerId)} (@${(await bot.helpers.getUser(guildInfo.ownerId)).username}) / ${guildInfo.ownerId}\``,
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.members'),
                        value: t('commands:server.info.fields.members_suffix', { members: (await bot.helpers.getMembers(guildInfo.id, { limit: 1000 })).size.toString() }),
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.channels'),
                        value: t('commands:server.info.fields.channels_suffix', { channels: channels.size.toString() }),
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.text_channels'),
                        value: textChannelString,
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.voice_channels'),
                        value: voiceChannelString,
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.roles'),
                        value: rolesString,
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.emojis'),
                        value: emojiString,
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.boosts'),
                        value: boostString,
                        inline: true
                    }],
                    thumbnail: {
                        url: bot.helpers.getGuildIconURL(guildInfo.id, guildInfo.icon, { size: 1024 }) ?? undefined
                    },
                    image: {
                        url: bot.helpers.getGuildSplashURL(guildInfo.id, guildInfo.splash, { size: 2048 }) ?? undefined
                    }
                });

                const row = createActionRow([createButton({
                    label: t('commands:server.info.buttons.view_icon'),
                    style: ButtonStyles.Secondary,
                    customId: createCustomId(0, context.author.id, context.commandId),
                    emoji: {
                        id: bot.emotes.FOXY_DRINKING_COFFEE
                    },
                    disabled: guildInfo.icon ? false : true
                }),

                // TO FINISH
                // createButton({
                //     label: t('commands:server.info.buttons.view_splash'),
                //     style: ButtonStyles.Secondary,
                //     customId: createCustomId(1, context.author.id, context.commandId),
                //     emoji: {
                //         id: bot.emotes.FOXY_DRINKING_COFFEE
                //     },
                //     disabled: guildInfo.splash ? false : true
                // }),

                // createButton({
                //     label: t('commands:server.info.buttons.view_banner'),
                //     style: ButtonStyles.Secondary,
                //     customId: createCustomId(2, context.author.id, context.commandId),
                //     emoji: {
                //         id: bot.emotes.FOXY_DRINKING_COFFEE
                //     },
                //     disabled: guildInfo.banner ? false : true
                // })
                ]);

                context.sendReply({
                    embeds: [embed]
                });

                return endCommand();
            }

            case "icon": {
                if (!guildInfo.icon) return context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:server.icon.no_icon'))
                });

                const embed = createEmbed({
                    title: t('commands:server.icon.title', { server: guildInfo.name }),
                    image: {
                        url: bot.helpers.getGuildIconURL(guildInfo.id, guildInfo.icon, { size: 1024 })
                    }
                });

                const row = createActionRow([createButton({
                    label: t('commands:server.icon.buttons.view'),
                    style: ButtonStyles.Link,
                    url: bot.helpers.getGuildIconURL(guildInfo.id, guildInfo.icon, { size: 1024 }),
                    emoji: {
                        id: bot.emotes.FOXY_YAY
                    }
                })]
                );

                context.sendReply({
                    embeds: [embed],
                    components: [row]
                });

                return endCommand();
            }

            case "banner": {
                if (!guildInfo.banner) return context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:server.banner.no_banner'))
                });

                const embed = createEmbed({
                    title: t('commands:server.banner.title', { server: guildInfo.name }),
                    image: {
                        url: bot.helpers.getGuildBannerURL(guildInfo.id, { banner: guildInfo.banner, size: 1024 }) ?? undefined
                    }
                });

                const row = createActionRow([createButton({
                    label: t('commands:server.banner.buttons.view'),
                    style: ButtonStyles.Link,
                    url: bot.helpers.getGuildBannerURL(guildInfo.id, { banner: guildInfo.banner, size: 1024 }) ?? undefined,
                    emoji: {
                        id: bot.emotes.FOXY_YAY
                    }
                })
                ]);

                context.sendReply({
                    embeds: [embed],
                    components: [row]
                });
            }
        }
    }
});

export default ServerCommand;