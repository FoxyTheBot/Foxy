import { createCommand } from "../../structures/commands/createCommand";
import { bot } from "../..";
import { ApplicationCommandOptionTypes, ButtonStyles, ChannelTypes } from "discordeno/types";
import { MessageFlags } from "../../utils/discord/Message";
import { createEmbed } from "../../utils/discord/Embed";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { Channel, Role, User } from "discordeno/transformers";

/* Invite Blocker imports */

import InviteBlockerEnableExecutor from "../../utils/commands/executors/mod/inviteblocker/InviteBlockerEnableExecutor";
import InviteBlockerDisableExecutor from "../../utils/commands/executors/mod/inviteblocker/InviteBlockerDisableExecutor";
import AddMessageExecutor from "../../utils/commands/executors/mod/inviteblocker/AddMessageExecutor";
import ResetConfigExecutor from "../../utils/commands/executors/mod/inviteblocker/ResetConfigExecutor";
import ModalSentExecutor from "../../utils/commands/executors/mod/inviteblocker/ModalSentExecutor";

const ConfigAutoModCommand = createCommand({
    name: "automod",
    description: "[Moderation] Commands relationed to AutoMod modules (AntiInvite, AutoRole...)",
    category: "mod",
    descriptionLocalizations: {
        "pt-BR": "[Moderação] Comandos relacionados aos módulos de AutoMod (AntiInvite, AutoRole...)"
    },
    options: [{
        name: "inviteblocker",
        description: "[Moderation] Commands relationed to AntiInvite module",
        nameLocalizations: {
            "pt-BR": "bloqueio_de_convites"
        },
        descriptionLocalizations: {
            "pt-BR": "[Moderação] Comandos relacionados ao módulo de AntiInvite"
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
        },
        {
            name: "addrole",
            description: "[Moderation] Add a role to bypass invite blocker",
            nameLocalizations: {
                "pt-BR": "adicionar_cargo"
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
                "pt-BR": "adicionar_canal"
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
                required: true,
                channelTypes: [ChannelTypes.GuildText, ChannelTypes.GuildAnnouncement]
            }]
        },
        {
            name: "remove_role",
            description: "[Moderation] Remove a role to bypass invite blocker",
            nameLocalizations: {
                "pt-BR": "remover_cargo"
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
            name: "remove_channel",
            description: "[Moderation] Remove a channel where invite blocker will be disabled",
            nameLocalizations: {
                "pt-BR": "remover_canal"
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
                required: true,
                channelTypes: [ChannelTypes.GuildText, ChannelTypes.GuildAnnouncement]
            }]
        },
        {
            name: "adduser",
            description: "[Moderation] Add a user to bypass invite blocker",
            nameLocalizations: {
                "pt-BR": "adicionar_usuario"
            },
            descriptionLocalizations: {
                "pt-BR": "[Moderação] Adiciona um usuário para burlar o bloqueio de convites"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "user",
                description: "User to bypass invite blocker",
                nameLocalizations: {
                    "pt-BR": "usuário"
                },
                descriptionLocalizations: {
                    "pt-BR": "Usuário para burlar o bloqueio de convites"
                },
                type: ApplicationCommandOptionTypes.User,
                required: true
            }]
        },
        {
            name: "remove_user",
            description: "[Moderation] Remove a user to bypass invite blocker",
            nameLocalizations: {
                "pt-BR": "remover_usuario"
            },
            descriptionLocalizations: {
                "pt-BR": "[Moderação] Remove um usuário para burlar o bloqueio de convites"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "user",
                description: "User you want to remove from bypassing invite blocker",
                nameLocalizations: {
                    "pt-BR": "usuário"
                },
                descriptionLocalizations: {
                    "pt-BR": "Usuário que você deseja remover do bloqueio de convites"
                },
                type: ApplicationCommandOptionTypes.User,
                required: true
            }]
        }]
    },
    {
        name: "autorole",
        description: "[Moderation] Commands relationed to autorole module",
        descriptionLocalizations: {
            "pt-BR": "[Moderação] Comandos relacionados ao módulo de autorole"
        },
        type: ApplicationCommandOptionTypes.SubCommandGroup,
        options: [{
            name: "enable",
            description: "[Moderation] Enable auto role module",
            nameLocalizations: {
                "pt-BR": "ativar"
            },
            descriptionLocalizations: {
                "pt-BR": "[Moderação] Ativa o módulo de cargos automáticos"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        },
        {
            name: "disable",
            description: "[Moderation] Disable auto role module",
            nameLocalizations: {
                "pt-BR": "desativar"
            },
            descriptionLocalizations: {
                "pt-BR": "[Moderação] Desativa o módulo de cargos automáticos"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        },
        {
            name: "add_role",
            description: "[Moderation] Add a role to be given automatically",
            nameLocalizations: {
                "pt-BR": "adicionar_cargo"
            },
            descriptionLocalizations: {
                "pt-BR": "[Moderação] Adicione um cargo para ser dado automaticamente"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "role",
                description: "Role to be given automatically",
                nameLocalizations: {
                    "pt-BR": "cargo"
                },
                descriptionLocalizations: {
                    "pt-BR": "Cargo a ser dado automaticamente"
                },
                type: ApplicationCommandOptionTypes.Role,
                required: true
            }]
        },
        {
            name: "remove_role",
            description: "[Moderation] Remove a role to be given automatically",
            nameLocalizations: {
                "pt-BR": "remover_cargo"
            },
            descriptionLocalizations: {
                "pt-BR": "[Moderação] Remova um cargo para ser dado automaticamente"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "role",
                description: "Role to be given automatically",
                nameLocalizations: {
                    "pt-BR": "cargo"
                },
                descriptionLocalizations: {
                    "pt-BR": "Cargo a ser dado automaticamente"
                },
                type: ApplicationCommandOptionTypes.Role,
                required: true
            }]
        }],
    }],
    commandRelatedExecutions: [
        /* Invite Blocker Executors */

        InviteBlockerEnableExecutor, // 0
        InviteBlockerDisableExecutor, // 1
        AddMessageExecutor, // 2
        ResetConfigExecutor,// 3
        ModalSentExecutor, // 4
    ],
    execute: async (context, endCommand, t) => {
        const subCommandGroup = context.getSubCommandGroup();
        const subCommand = context.getSubCommand();
        const guildInfo = await bot.database.getGuild(context.guildId);
        const role = await context.getOption<Role>("role", false);
        const channel = await context.getOption<Channel>("channel", false);
        const user = await context.getOption<User>("user", "users");

        switch (subCommandGroup) {
            case "inviteblocker": {
                if (!bot.utils.calculatePermissions(context.guildMember.permissions).includes("MANAGE_MESSAGES" || "ADMINISTRATOR")) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:global.noPermission", {
                            permission: t("permissions:ManageMessages")
                        })),
                        flags: MessageFlags.EPHEMERAL
                    })
                    return endCommand();
                }

                switch (subCommand) {
                    case "config": {
                        context.sendDefer(true);
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
                                value: guildInfo.InviteBlockerModule.whitelistedChannels.length > 0 ? guildInfo.InviteBlockerModule.whitelistedChannels.map(channelId => `<#${channelId}>`).join(", ") : t("commands:inviteBlocker.config.fields.noWhitelistedChannels")
                            },
                            {
                                name: t("commands:inviteBlocker.config.fields.whitelistedRoles"),
                                value: guildInfo.InviteBlockerModule.whitelistedRoles.length > 0 ? guildInfo.InviteBlockerModule.whitelistedRoles.map(roleId => `<@&${roleId}>`).join(", ") : t("commands:inviteBlocker.config.fields.noWhitelistedRoles")
                            },
                            {
                                name: t("commands:inviteBlocker.config.fields.whitelistedUsers"),
                                value: guildInfo.InviteBlockerModule.whitelistedUsers.length > 0 ? guildInfo.InviteBlockerModule.whitelistedUsers.map(userId => `<@${userId}>`).join(", ") : t("commands:inviteBlocker.config.fields.noWhitelistedUsers")
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
                            components: [actionRow],
                            flags: MessageFlags.EPHEMERAL
                        });
                        return endCommand();
                    }

                    case "addrole": {
                        if (guildInfo.InviteBlockerModule.whitelistedRoles.includes(role)) {
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.alreadyWhitelistedRole", { role: `<@&${role}>` })),
                                flags: MessageFlags.EPHEMERAL
                            })
                            return endCommand();
                        } else {
                            if (guildInfo.InviteBlockerModule.whitelistedRoles.length >= 5) {
                                context.sendReply({
                                    content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.maxWhitelistedRoles")),
                                    flags: MessageFlags.EPHEMERAL
                                })
                                return endCommand();
                            }
                            guildInfo.InviteBlockerModule.whitelistedRoles.push(role);
                            await guildInfo.save();
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:inviteBlocker.config.addedWhitelistedRole", { role: `<@&${role}>` })),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        }
                    }

                    case "remove_role": {
                        if (!guildInfo.InviteBlockerModule.whitelistedRoles.includes(role)) {
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.notWhitelistedRole", { role: `<@&${role}>` })),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        } else {
                            guildInfo.InviteBlockerModule.whitelistedRoles.splice(guildInfo.InviteBlockerModule.whitelistedRoles.indexOf(role), 1);
                            await guildInfo.save();
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:inviteBlocker.config.removedWhitelistedRole", { role: `<@&${role}>` })),
                                flags: MessageFlags.EPHEMERAL
                            });
                        }

                        return endCommand();
                    }

                    case "addchannel": {
                        if (guildInfo.InviteBlockerModule.whitelistedChannels.includes(channel)) {
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.alreadyWhitelistedChannel", { channel: `<#${channel}>` })),
                                flags: MessageFlags.EPHEMERAL
                            })
                            return endCommand();
                        } else {
                            if (guildInfo.InviteBlockerModule.whitelistedChannels.length >= 10) {
                                context.sendReply({
                                    content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.maxWhitelistedChannels")),
                                    flags: MessageFlags.EPHEMERAL
                                })
                                return endCommand();
                            }
                            guildInfo.InviteBlockerModule.whitelistedChannels.push(channel);
                            await guildInfo.save();
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:inviteBlocker.config.addedWhitelistedChannel", { channel: `<#${channel}>` })),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        }
                    }

                    case "remove_channel": {
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
                            return endCommand();
                        }
                    }

                    case "adduser": {
                        if (guildInfo.InviteBlockerModule.whitelistedUsers.includes(user.id.toString())) {
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.alreadyWhitelistedUser", { user: `<@${user.id}>` })),
                                flags: MessageFlags.EPHEMERAL
                            })
                            return endCommand();
                        } else {
                            guildInfo.InviteBlockerModule.whitelistedUsers.push(user.id.toString());
                            await guildInfo.save();
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:inviteBlocker.config.addedWhitelistedUser", { user: `<@${user.id}>` })),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        }
                    }

                    case "remove_user": {
                        if (!guildInfo.InviteBlockerModule.whitelistedUsers.includes(user.id)) {
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.notWhitelistedUser", { user: `<@${user.id}>` })),
                                flags: MessageFlags.EPHEMERAL
                            })
                            return endCommand();
                        } else {
                            guildInfo.InviteBlockerModule.whitelistedUsers.splice(guildInfo.InviteBlockerModule.whitelistedUsers.indexOf(user.id), 1);
                            await guildInfo.save();
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:inviteBlocker.config.removedWhitelistedUser", { user: `<@${user.id}>` })),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        }
                    }
                }
            }
            case "autorole": {
                if (!bot.utils.calculatePermissions(context.guildMember.permissions).includes("MANAGE_ROLES" || "ADMINISTRATOR")) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:global.noPermission", {
                            permission: t("permissions:ManageMessages")
                        })),
                        flags: MessageFlags.EPHEMERAL
                    })
                    return endCommand();
                }

                switch (subCommand) {
                    case "enable": {
                        if (guildInfo.AutoRoleModule.isEnabled) {
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:AutoRole.enable.alreadyEnabled")),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        } else {
                            guildInfo.AutoRoleModule.isEnabled = true;
                            await guildInfo.save();
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:AutoRole.enable.enabled")),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        }
                    }

                    case "disable": {
                        if (!guildInfo.AutoRoleModule.isEnabled) {
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:AutoRole.disable.alreadyDisabled")),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        } else {
                            guildInfo.AutoRoleModule.isEnabled = false;
                            await guildInfo.save();
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:AutoRole.disable.disabled")),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        }
                    }

                    case "add_role": {
                        if (guildInfo.AutoRoleModule.roles.includes(role)) {
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:AutoRole.addrole.alreadyAdded")),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        } else {
                            if (guildInfo.AutoRoleModule.roles.length >= 5) {
                                context.sendReply({
                                    content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:AutoRole.addrole.maxRoles")),
                                    flags: MessageFlags.EPHEMERAL
                                });
                                return endCommand();
                            }
                            guildInfo.AutoRoleModule.roles.push(role);
                            await guildInfo.save();
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:AutoRole.addrole.added")),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        }
                    }

                    case "remove_role": {
                        if (!guildInfo.AutoRoleModule.roles.includes(role)) {
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:AutoRole.removerole.notAdded")),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        } else {
                            guildInfo.AutoRoleModule.roles.splice(guildInfo.AutoRoleModule.roles.indexOf(role), 1);
                            await guildInfo.save();
                            context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_YAY, t("commands:AutoRole.removerole.removed")),
                                flags: MessageFlags.EPHEMERAL
                            });
                            return endCommand();
                        }
                    }
                }
            }
        }
    }
});

export default ConfigAutoModCommand;