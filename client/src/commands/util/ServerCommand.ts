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
    }],
    execute: async (context, endCommand, t) => {
        const subCommand = context.getSubCommand();

        switch (subCommand) {
            case "info": {
                const serverId = context.getOption<string>('server_id', false) ?? context.guildId;
                const guildInfo = await bot.helpers.getGuild(serverId);
                const channels = await bot.helpers.getChannels(serverId);

                if (!guildInfo) return context.sendReply({
                    content: t('commands:server.info.not_found'),
                    flags: MessageFlags.EPHEMERAL
                });

                const embed = createEmbed({
                    title: t('commands:server.info.title', { server: guildInfo.name }),
                    fields: [{
                        name: "ID",
                        value: guildInfo.id.toString(),
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.owner'),
                        value: `\`${await bot.foxyRest.getUserDisplayName(guildInfo.ownerId)} (@${(await bot.helpers.getUser(guildInfo.ownerId)).username}) / ${guildInfo.ownerId}\``,
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.members'),
                        value: (await bot.helpers.getMembers(guildInfo.id, { limit: 1000 })).size + " " + t('commands:server.info.fields.members_suffix'),
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.channels'),
                        value: channels.size.toString() + " " + t('commands:server.info.fields.channels_suffix'),
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.text_channels'),
                        value: channels.filter(c => c.type === ChannelTypes.GuildText).size.toString() + " " + t('commands:server.info.fields.text_channels_suffix'),
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.voice_channels'),
                        value: channels.filter(c => c.type === ChannelTypes.GuildVoice).size.toString() + " " + t('commands:server.info.fields.voice_channels_suffix'),
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.roles'),
                        value: guildInfo.roles.size.toString() + " " + t('commands:server.info.fields.roles_suffix'),
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.emojis'),
                        value: guildInfo.emojis.size.toString() + ' emojis',
                        inline: true
                    },
                    {
                        name: t('commands:server.info.fields.boosts'),
                        value: guildInfo.premiumSubscriptionCount.toString() + " " + t('commands:server.info.fields.boosts_suffix'),
                        inline: true
                    }],
                    thumbnail: {
                        url: bot.helpers.getGuildIconURL(guildInfo.id, guildInfo.icon, { size: 1024 })
                    }
                });

                context.sendReply({
                    embeds: [embed]
                });

                return endCommand();
            }

            case "icon": {
                const serverId = context.getOption<string>('server_id', false) ?? context.guildId;
                const guildInfo = await bot.helpers.getGuild(serverId);

                if (!guildInfo) return context.sendReply({
                    content: t('commands:server.icon.not_found'),
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
                    url: bot.helpers.getGuildIconURL(guildInfo.id, guildInfo.icon, { size: 1024 })
                })]
                );

                context.sendReply({
                    embeds: [embed],
                    components: [row]
                });

                return endCommand();
            }
        }
    }
});

export default ServerCommand;