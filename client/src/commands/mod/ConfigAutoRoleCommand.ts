import { createCommand } from "../../structures/commands/createCommand";
import { bot } from "../..";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { createEmbed } from "../../utils/discord/Embed";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { MessageFlags } from "../../utils/discord/Message";
import { Role } from "discordeno/transformers";

const ConfigAutoRoleCommand = createCommand({
    name: "autorole",
    description: "Configure the module to give roles automatically for who join the server",
    category: "mod",
    descriptionLocalizations: {
        "pt-BR": "Configure o módulo para dar cargos automaticamente para quem entrar no servidor"
    },
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
        name: "addrole",
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
        name: "removerole",
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
    async execute(context, endCommand, t) {
        const SubCommand = context.getSubCommand();

        if (!bot.utils.calculatePermissions(context.guildMember.permissions).includes("MANAGE_ROLES" || "ADMINISTRATOR")) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:global.noPermission", {
                    permission: t("permissions:ManageRoles")
                })),
                flags: MessageFlags.EPHEMERAL
            })
            return endCommand();
        }

        const guildInfo = await bot.database.getGuild(context.interaction.guildId);

        switch (SubCommand) {
            case "enable": {
                if (guildInfo.AutoRoleModule.isEnabled) {
                    context.sendReply({
                        content: t("commands:AutoRole.enable.alreadyEnabled"),
                        flags: MessageFlags.EPHEMERAL
                    });
                    return endCommand();
                } else {
                    guildInfo.AutoRoleModule.isEnabled = true;
                    await guildInfo.save();
                    context.sendReply({
                        content: t("commands:AutoRole.enable.enabled"),
                        flags: MessageFlags.EPHEMERAL
                    });
                    endCommand();
                    break;
                }
            }

            case "disable": {
                if (!guildInfo.AutoRoleModule.isEnabled) {
                    context.sendReply({
                        content: t("commands:AutoRole.disable.alreadyDisabled"),
                        flags: MessageFlags.EPHEMERAL
                    });
                    return endCommand();
                } else {
                    guildInfo.AutoRoleModule.isEnabled = false;
                    await guildInfo.save();
                    context.sendReply({
                        content: t("commands:AutoRole.disable.disabled"),
                        flags: MessageFlags.EPHEMERAL
                    });
                    endCommand();
                    break;
                }
            }

            case "addrole": {
                const role = context.getOption<Role>("role", false);

                if (guildInfo.AutoRoleModule.roles.includes(role)) {
                    context.sendReply({
                        content: t("commands:AutoRole.addrole.alreadyAdded"),
                        flags: MessageFlags.EPHEMERAL
                    });
                    return endCommand();
                } else {
                    if (guildInfo.AutoRoleModule.roles.length >= 5) {
                        context.sendReply({
                            content: t("commands:AutoRole.addrole.maxRoles"),
                            flags: MessageFlags.EPHEMERAL
                        });
                        return endCommand();
                    }
                    guildInfo.AutoRoleModule.roles.push(role);
                    await guildInfo.save();
                    context.sendReply({
                        content: t("commands:AutoRole.addrole.added"),
                        flags: MessageFlags.EPHEMERAL
                    });
                    endCommand();
                    break;
                }
            }

            case "removerole": {
                const role = context.getOption<Role>("role", false);

                if (!guildInfo.AutoRoleModule.roles.includes(role)) {
                    context.sendReply({
                        content: t("commands:AutoRole.removerole.notAdded"),
                        flags: MessageFlags.EPHEMERAL
                    });
                    return endCommand();
                } else {
                    guildInfo.AutoRoleModule.roles.splice(guildInfo.AutoRoleModule.roles.indexOf(role), 1);
                    await guildInfo.save();
                    context.sendReply({
                        content: t("commands:AutoRole.removerole.removed"),
                        flags: MessageFlags.EPHEMERAL
                    });
                    endCommand();
                    break;
                }
            }
        }
    }
});

export default ConfigAutoRoleCommand;