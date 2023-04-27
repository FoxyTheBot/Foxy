import { createCommand } from "../../structures/commands/createCommand";
import { bot } from "../..";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { createEmbed } from "../../utils/discord/Embed";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import InviteBlockerEnableExecutor from "../../utils/commands/executors/mod/inviteblocker/InviteBlockerEnableExecutor";
import InviteBlockerDisableExecutor from "../../utils/commands/executors/mod/inviteblocker/InviteBlockerDisableExecutor";
import AddMessageExecutor from "../../utils/commands/executors/mod/inviteblocker/AddMessageExecutor";
import ResetConfigExecutor from "../../utils/commands/executors/mod/inviteblocker/ResetConfigExecutor";
import ModalSentExecutor from "../../utils/commands/executors/mod/inviteblocker/ModalSentExecutor";
import { Channel, Role } from "discordeno/transformers";
import { MessageFlags } from "../../utils/discord/Message";

const ConfigInviteBlockerCommand = createCommand({
    name: "invite",
    description: "[Moderation] Commands relationed to invite blocker module",
    category: "mod",
    nameLocalizations: {
        "pt-BR": "bloquear"
    },
    descriptionLocalizations: {
        "pt-BR": "[Moderação] Comandos relacionados ao módulo de bloqueio de convites"
    },
    options: [{
        name: "blocker",
        description: "[Moderation] Enable or disable invite blocker module",
        nameLocalizations: {
            "pt-BR": "convites"
        },
        descriptionLocalizations: {
            "pt-BR": "[Moderação] Ativa ou desativa o módulo de bloqueio de convites"
        },
        type: ApplicationCommandOptionTypes.SubCommandGroup,
        options: [{
            name: "config",
            description: "[Moderation] Configure me to block invites in your server",
            nameLocalizations: {
                "pt-BR": "configurar"
            },
            descriptionLocalizations: {
                "pt-BR": "[Moderação] Configure-me para bloquear convites no seu servidor"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "roles",
                description: "Roles that can bypass invite blocker",
                nameLocalizations: {
                    "pt-BR": "cargos"
                },
                descriptionLocalizations: {
                    "pt-BR": "Cargos que podem burlar o bloqueio de convites"
                },
                type: ApplicationCommandOptionTypes.Role,
                required: false
            },
            {
                name: "channels",
                description: "Channels where invite blocker will be disabled",
                nameLocalizations: {
                    "pt-BR": "canais"
                },
                descriptionLocalizations: {
                    "pt-BR": "Canais onde o bloqueio de convites será desativado"
                },
                type: ApplicationCommandOptionTypes.Channel,
                required: false
            }]
        },
        {
            name: "addrole",
            description: "[Moderation] Add a role to bypass invite blocker",
            nameLocalizations: {
                "pt-BR": "addcargo"
            },
            descriptionLocalizations: {
                "pt-BR": "[Moderação] Adiciona um cargo para burlar o bloqueio de convites"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "role",
                description: "Role to bypass invite blocker",
                nameLocalizations: {
                    "pt-BR": "cargo"
                },
                descriptionLocalizations: {
                    "pt-BR": "Cargo para burlar o bloqueio de convites"
                },
                type: ApplicationCommandOptionTypes.Role,
                required: true
            }]
        },
        {
            name: "addchannel",
            description: "[Moderation] Add a channel where invite blocker will be disabled",
            nameLocalizations: {
                "pt-BR": "addcanal"
            },
            descriptionLocalizations: {
                "pt-BR": "[Moderação] Adiciona um canal onde o bloqueio de convites será desativado"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "channel",
                description: "Channel where invite blocker will be disabled",
                nameLocalizations: {
                    "pt-BR": "canal"
                },
                descriptionLocalizations: {
                    "pt-BR": "Canal onde o bloqueio de convites será desativado"
                },
                type: ApplicationCommandOptionTypes.Channel,
                required: true
            }]
        },
        {
            name: "removerole",
            description: "[Moderation] Remove a role to bypass invite blocker",
            nameLocalizations: {
                "pt-BR": "removercargo"
            },
            descriptionLocalizations: {
                "pt-BR": "[Moderação] Remove um cargo para burlar o bloqueio de convites"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "role",
                description: "Role to bypass invite blocker",
                nameLocalizations: {
                    "pt-BR": "cargo"
                },
                descriptionLocalizations: {
                    "pt-BR": "Cargo para burlar o bloqueio de convites"
                },
                type: ApplicationCommandOptionTypes.Role,
                required: true
            }]
        },
        {
            name: "removechannel",
            description: "[Moderation] Remove a channel where invite blocker will be disabled",
            nameLocalizations: {
                "pt-BR": "removercanal"
            },
            descriptionLocalizations: {
                "pt-BR": "[Moderação] Remove um canal onde o bloqueio de convites será desativado"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "channel",
                description: "Channel where invite blocker will be disabled",
                nameLocalizations: {
                    "pt-BR": "canal"
                },
                descriptionLocalizations: {
                    "pt-BR": "Canal onde o bloqueio de convites será desativado"
                },
                type: ApplicationCommandOptionTypes.Channel,
            }]
        }]
    }],
    commandRelatedExecutions: [
        InviteBlockerEnableExecutor,
        InviteBlockerDisableExecutor,
        AddMessageExecutor,
        ResetConfigExecutor,
        ModalSentExecutor
    ],
    async execute(context, endCommand, t) {
        const guildInfo = await bot.database.getGuild(context.guildId);
        const roles = await context.getOption<Role>("roles", false);
        const channels = await context.getOption<Channel>("channels", false);
        const role = await context.getOption<Role>("role", false);
        const channel = await context.getOption<Channel>("channel", false);

        const SubCommand = context.getSubCommand();
        if (!bot.utils.calculatePermissions(context.guildMember.permissions).includes("MANAGE_MESSAGES" || "ADMINISTRATOR")) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:global.noPermission", {
                    permission: t("permissions:ManageMessages")
                })),
                flags: MessageFlags.EPHEMERAL
            })
            return endCommand();
        }

        switch (SubCommand) {
            case "config": {
                if (roles) {
                    if (!await guildInfo.InviteBlockerModule.whitelistedRoles.includes(roles)) {
                        guildInfo.InviteBlockerModule.whitelistedRoles.push(roles);
                        await guildInfo.save();
                    } else {
                        context.sendReply({
                            content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.alreadyWhitelistedRole", { role: `<@&${roles}>` })),
                            flags: MessageFlags.EPHEMERAL
                        })
                        return endCommand();
                    }
                }

                if (channels) {
                    if (!await guildInfo.InviteBlockerModule.whitelistedChannels.includes(channels)) {
                        guildInfo.InviteBlockerModule.whitelistedChannels.push(channels);
                        await guildInfo.save();
                    } else {
                        guildInfo.InviteBlockerModule.whitelistedChannels.push(channels);
                        await guildInfo.save();
                    }
                }
                context.sendDefer();
                const embed = createEmbed({
                    title: t("commands:inviteBlocker.config.title"),
                    description: t("commands:inviteBlocker.config.description"),
                    fields: [{
                        name: t("commands:inviteBlocker.config.fields.isEnabled"),
                        value: guildInfo.InviteBlockerModule.isEnabled ?
                            `${context.getEmojiById(bot.emotes.FOXY_YAY)} ${t("commands:inviteBlocker.config.fields.isEnabledValue.enabled")}`
                            : `${context.getEmojiById(bot.emotes.FOXY_CRY)} ${t("commands:inviteBlocker.config.fields.isEnabledValue.disabled")}`

                    },
                    {
                        name: t("commands:inviteBlocker.config.fields.blockMessage"),
                        value: guildInfo.InviteBlockerModule.blockMessage ?? t('commands:inviteBlocker.config.fields.noBlockMessage'),
                    },
                    {
                        name: t("commands:inviteBlocker.config.fields.whitelistedChannels"),
                        value: guildInfo.InviteBlockerModule.whitelistedChannels.length > 0 ? guildInfo.InviteBlockerModule.whitelistedChannels.map(channelId => `<#${channels ?? channelId}>`).join(", ") : t("commands:inviteBlocker.config.fields.noWhitelistedChannels")
                    },
                    {
                        name: t("commands:inviteBlocker.config.fields.whitelistedRoles"),
                        value: guildInfo.InviteBlockerModule.whitelistedRoles.length > 0 ? guildInfo.InviteBlockerModule.whitelistedRoles.map(roleId => `<@&${roles ?? roleId}>`).join(", ") : t("commands:inviteBlocker.config.fields.noWhitelistedRoles")
                    }]
                });

                var actionRow;
                if (guildInfo.InviteBlockerModule.isEnabled) {
                    actionRow = createActionRow([createButton({
                        label: t("commands:inviteBlocker.config.buttons.disable"),
                        style: ButtonStyles.Danger,
                        customId: createCustomId(1, context.author.id, context.commandId)
                    }),
                    createButton({
                        label: t("commands:inviteBlocker.config.buttons.blockMessage"),
                        style: ButtonStyles.Primary,
                        customId: createCustomId(2, context.author.id, context.commandId)
                    }),
                    createButton({
                        label: t("commands:inviteBlocker.config.buttons.reset"),
                        style: ButtonStyles.Secondary,
                        customId: createCustomId(3, context.author.id, context.commandId)
                    })
                    ]);

                } else {
                    actionRow = createActionRow([createButton({
                        label: t("commands:inviteBlocker.config.buttons.enable"),
                        style: ButtonStyles.Success,
                        customId: createCustomId(0, context.author.id, context.commandId)
                    }),
                    createButton({
                        label: t("commands:inviteBlocker.config.buttons.blockMessage"),
                        style: ButtonStyles.Secondary,
                        disabled: true,
                        customId: createCustomId(2, context.author.id, context.commandId)
                    }),
                    createButton({
                        label: t("commands:inviteBlocker.config.buttons.reset"),
                        style: ButtonStyles.Secondary,
                        disabled: true,
                        customId: createCustomId(3, context.author.id, context.commandId)
                    })
                    ]);
                }
                context.sendReply({
                    embeds: [embed],
                    components: [actionRow]
                });
                endCommand();
                break;
            }

            case "addrole": {
                if (guildInfo.InviteBlockerModule.whitelistedRoles.includes(role)) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.alreadyWhitelistedRole", { role: `<@&${role}>` })),
                        flags: MessageFlags.EPHEMERAL
                    })
                    return endCommand();
                } else {
                    guildInfo.InviteBlockerModule.whitelistedRoles.push(role);
                    await guildInfo.save();
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:inviteBlocker.config.addedWhitelistedRole", { role: `<@&${role}>` })),
                        flags: MessageFlags.EPHEMERAL
                    });
                }
                endCommand();
                break;
            }

            case "removerole": {
                if (!guildInfo.InviteBlockerModule.whitelistedRoles.includes(role)) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.notWhitelistedRole", { role: `<@&${role}>` })),
                        flags: MessageFlags.EPHEMERAL
                    })
                    return endCommand();
                } else {
                    guildInfo.InviteBlockerModule.whitelistedRoles.splice(guildInfo.InviteBlockerModule.whitelistedRoles.indexOf(role), 1);
                    await guildInfo.save();
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:inviteBlocker.config.removedWhitelistedRole", { role: `<@&${role}>` })),
                        flags: MessageFlags.EPHEMERAL
                    });
                }

                endCommand();
                break;
            }

            case "addchannel": {
                if (guildInfo.InviteBlockerModule.whitelistedChannels.includes(channel)) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.alreadyWhitelistedChannel", { channel: `<#${channel}>` })),
                        flags: MessageFlags.EPHEMERAL
                    })
                    return endCommand();
                } else {
                    guildInfo.InviteBlockerModule.whitelistedChannels.push(channel);
                    await guildInfo.save();
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:inviteBlocker.config.addedWhitelistedChannel", { channel: `<#${channel}>` })),
                        flags: MessageFlags.EPHEMERAL
                    });
                }

                endCommand();
                break;
            }

            case "removechannel": {
                if (!guildInfo.InviteBlockerModule.whitelistedChannels.includes(channel)) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.notWhitelistedChannel", { channel: `<#${channel}>` })),
                        flags: MessageFlags.EPHEMERAL
                    })
                    return endCommand();
                } else {
                    guildInfo.InviteBlockerModule.whitelistedChannels.splice(guildInfo.InviteBlockerModule.whitelistedChannels.indexOf(channel), 1);
                    await guildInfo.save();
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:inviteBlocker.config.removedWhitelistedChannel", { channel: `<#${channel}>` })),
                        flags: MessageFlags.EPHEMERAL
                    });
                }
            }
        }
    }
});

export default ConfigInviteBlockerCommand;