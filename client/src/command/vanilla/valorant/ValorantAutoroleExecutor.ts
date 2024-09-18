import { FoxyClient } from "../../../structures/types/FoxyClient";
import { createActionRow, createCustomId, createSelectMenu } from "../../../utils/discord/Component";
import { MessageFlags } from "../../../utils/discord/Message";
import ValAutoRoleModule from "../../../utils/modules/ValorantAutoRoleModule";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export async function ValorantAutoRoleExecutor(bot: FoxyClient, context, endCommand, t) {
    if (!bot.utils.calculatePermissions(context.guildMember.permissions).includes("MANAGE_ROLES" || "ADMINISTRATOR")) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:global.noPermission", {
                permission: t("permissions:ManageRoles")
            })),
            flags: MessageFlags.EPHEMERAL
        })
        return endCommand();
    }

    const guildInfo = await bot.database.getGuild(context.guildId);
    context.sendReply({
        embeds: [{
            color: bot.colors.VALORANT,
            title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.autorole.title')),
            description: t('commands:valorant.autorole.description'),
            fields: [{
                name: t('commands:valorant.autorole.ranks.unrated', { emoji: context.getEmojiById(bot.emotes.UNRATED) }),
                value: guildInfo.valAutoRoleModule.unratedRole ? `<@&${guildInfo.valAutoRoleModule.unratedRole}>` : t('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: t('commands:valorant.autorole.ranks.iron', { emoji: context.getEmojiById(bot.emotes.I3) }),
                value: guildInfo.valAutoRoleModule.ironRole ? `<@&${guildInfo.valAutoRoleModule.ironRole}>` : t('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: t('commands:valorant.autorole.ranks.bronze', { emoji: context.getEmojiById(bot.emotes.B3) }),
                value: guildInfo.valAutoRoleModule.bronzeRole ? `<@&${guildInfo.valAutoRoleModule.bronzeRole}>` : t('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: t('commands:valorant.autorole.ranks.silver', { emoji: context.getEmojiById(bot.emotes.S3) }),
                value: guildInfo.valAutoRoleModule.silverRole ? `<@&${guildInfo.valAutoRoleModule.silverRole}>` : t('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: t('commands:valorant.autorole.ranks.gold', { emoji: context.getEmojiById(bot.emotes.G3) }),
                value: guildInfo.valAutoRoleModule.goldRole ? `<@&${guildInfo.valAutoRoleModule.goldRole}>` : t('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: t('commands:valorant.autorole.ranks.platinum', { emoji: context.getEmojiById(bot.emotes.P3) }),
                value: guildInfo.valAutoRoleModule.platinumRole ? `<@&${guildInfo.valAutoRoleModule.platinumRole}>` : t('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: t('commands:valorant.autorole.ranks.diamond', { emoji: context.getEmojiById(bot.emotes.D3) }),
                value: guildInfo.valAutoRoleModule.diamondRole ? `<@&${guildInfo.valAutoRoleModule.diamondRole}>` : t('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: t('commands:valorant.autorole.ranks.ascendant', { emoji: context.getEmojiById(bot.emotes.A3) }),
                value: guildInfo.valAutoRoleModule.ascendantRole ? `<@&${guildInfo.valAutoRoleModule.ascendantRole}>` : t('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: t('commands:valorant.autorole.ranks.immortal', { emoji: context.getEmojiById(bot.emotes.IM3) }),
                value: guildInfo.valAutoRoleModule.immortalRole ? `<@&${guildInfo.valAutoRoleModule.immortalRole}>` : t('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: t('commands:valorant.autorole.ranks.radiant', { emoji: context.getEmojiById(bot.emotes.R) }),
                value: guildInfo.valAutoRoleModule.radiantRole ? `<@&${guildInfo.valAutoRoleModule.radiantRole}>` : t('commands:valorant.autorole.ranks.none'),
                inline: true
            }]
        }],
        components: [createActionRow([
            createSelectMenu({
                customId: createCustomId(2, context.author.id, context.commandId),
                placeholder: t('commands:valorant.autorole.rankSelectorPlaceholder'),
                options: [{
                    label: t('commands:valorant.autorole.rankSelector.unrated'),
                    value: 'unratedRole',
                    emoji: {
                        id: BigInt(bot.emotes.UNRATED)
                    },
                    description: guildInfo.valAutoRoleModule.unratedRole ? t('commands:valorant.autorole.configured') : t('commands:valorant.autorole.ranks.none')
                },
                {
                    label: t('commands:valorant.autorole.rankSelector.iron'),
                    value: 'ironRole',
                    emoji: {
                        id: BigInt(bot.emotes.I3)
                    },
                    description: guildInfo.valAutoRoleModule.ironRole ? t('commands:valorant.autorole.configured') : t('commands:valorant.autorole.ranks.none')
                },
                {
                    label: t('commands:valorant.autorole.rankSelector.bronze'),
                    value: 'bronzeRole',
                    emoji: {
                        id: BigInt(bot.emotes.B3)
                    },
                    description: guildInfo.valAutoRoleModule.bronzeRole ? t('commands:valorant.autorole.configured') : t('commands:valorant.autorole.ranks.none')
                },
                {
                    label: t('commands:valorant.autorole.rankSelector.silver'),
                    value: 'silverRole',
                    emoji: {
                        id: BigInt(bot.emotes.S3)
                    },
                    description: guildInfo.valAutoRoleModule.silverRole ? t('commands:valorant.autorole.configured') : t('commands:valorant.autorole.ranks.none')

                },
                {
                    label: t('commands:valorant.autorole.rankSelector.gold'),
                    value: 'goldRole',
                    emoji: {
                        id: BigInt(bot.emotes.G3)
                    },
                    description: guildInfo.valAutoRoleModule.goldRole ? t('commands:valorant.autorole.configured') : t('commands:valorant.autorole.ranks.none')

                },
                {
                    label: t('commands:valorant.autorole.rankSelector.platinum'),
                    value: 'platinumRole',
                    emoji: {
                        id: BigInt(bot.emotes.P3)
                    },
                    description: guildInfo.valAutoRoleModule.platinumRole ? t('commands:valorant.autorole.configured') : t('commands:valorant.autorole.ranks.none')
                },
                {
                    label: t('commands:valorant.autorole.rankSelector.diamond'),
                    value: 'diamondRole',
                    emoji: {
                        id: BigInt(bot.emotes.D3)
                    },
                    description: guildInfo.valAutoRoleModule.diamondRole ? t('commands:valorant.autorole.configured') : t('commands:valorant.autorole.ranks.none')

                },
                {
                    label: t('commands:valorant.autorole.rankSelector.ascendant'),
                    value: 'ascendantRole',
                    emoji: {
                        id: BigInt(bot.emotes.A3)
                    },
                    description: guildInfo.valAutoRoleModule.ascendantRole ? t('commands:valorant.autorole.configured') : t('commands:valorant.autorole.ranks.none')
                },
                {
                    label: t('commands:valorant.autorole.rankSelector.immortal'),
                    value: 'immortalRole',
                    emoji: {
                        id: BigInt(bot.emotes.IM3)
                    },
                    description: guildInfo.valAutoRoleModule.immortalRole ? t('commands:valorant.autorole.configured') : t('commands:valorant.autorole.ranks.none')
                },
                {
                    label: t('commands:valorant.autorole.rankSelector.radiant'),
                    value: 'radiantRole',
                    emoji: {
                        id: BigInt(bot.emotes.R)
                    },
                    description: guildInfo.valAutoRoleModule.radiantRole ? t('commands:valorant.autorole.configured') : t('commands:valorant.autorole.ranks.none')
                }]
            })])]
    })
}

export async function ValorantUpdateAutoroleExecutor(bot, context: UnleashedCommandExecutor, endCommand, t) {
    const valAutoRoleModule = new ValAutoRoleModule(bot, context);
    const userInfo = await bot.database.getUser(context.author.id);
    if (!bot.hasGuildPermission(bot, context.guildId, ["MANAGE_ROLES"] || ["ADMINISTRATOR"])) {
        return context.sendReply({
            embeds: [{
                title: context.makeReply(bot.emotes.VALORANT_LOGO, bot.locale('commands:valorant.update-role.embed.title')),
                description: bot.locale('commands:valorant.update-role.embed.noPermission')
            }],
            flags: 64
        });
    };
    if (!userInfo.riotAccount.isLinked) {
        return context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:valorant.update-role.notLinkedAccount')),
            flags: 64
        });
    }
    return valAutoRoleModule.updateRole(context.guildMember).then((result) => {
        if (result === "ROLE_NOT_FOUND") {
            context.sendReply({
                embeds: [{
                    title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.update-role.embed.title')),
                    description: t('commands:valorant.update-role.embed.roleNotFound')
                }],
                flags: 64
            });
        } else {
            context.sendReply({
                embeds: [{
                    title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.update-role.embed.title')),
                    description: t('commands:valorant.update-role.embed.description')
                }],
                flags: 64
            });
        }
    });
}