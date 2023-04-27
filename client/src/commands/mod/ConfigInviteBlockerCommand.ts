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
        const role = await context.getOption<Role>("roles", false);
        const channel = await context.getOption<Channel>("channels", false);
        if (!bot.utils.calculatePermissions(context.guildMember.permissions).includes("MANAGE_MESSAGES" || "ADMINISTRATOR")) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:global.noPermission", {
                    permission: t("permissions:ManageMessages")
                })),
                flags: MessageFlags.EPHEMERAL
            })
            return endCommand();
        }

        if (role) {
            if (await guildInfo.InviteBlockerModule.whitelistedRoles.includes(role)) {
                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.alreadyWhitelistedRole", { role: `<@&${role}>` })),
                    flags: MessageFlags.EPHEMERAL
                })
                return endCommand();
            } else {
                guildInfo.InviteBlockerModule.whitelistedRoles.push(role);
                await guildInfo.save();
            }
        }

        if (channel) {
            if (await guildInfo.InviteBlockerModule.whitelistedChannels.includes(channel)) {
                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:inviteBlocker.config.errors.alreadyWhitelistedChannel", { channel: `<#${channel}>` })),
                    flags: MessageFlags.EPHEMERAL
                })
                return endCommand();
            } else {
                guildInfo.InviteBlockerModule.whitelistedChannels.push(channel);
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
                value: guildInfo.InviteBlockerModule.whitelistedChannels.length > 0 ? guildInfo.InviteBlockerModule.whitelistedChannels.map(channelId => `<#${channel ?? channelId}>`).join(", ") : t("commands:inviteBlocker.config.fields.noWhitelistedChannels")
            },
            {
                name: t("commands:inviteBlocker.config.fields.whitelistedRoles"),
                value: guildInfo.InviteBlockerModule.whitelistedRoles.length > 0 ? guildInfo.InviteBlockerModule.whitelistedRoles.map(roleId => `<@&${role ?? roleId}>`).join(", ") : t("commands:inviteBlocker.config.fields.noWhitelistedRoles")
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
    }
});

export default ConfigInviteBlockerCommand;