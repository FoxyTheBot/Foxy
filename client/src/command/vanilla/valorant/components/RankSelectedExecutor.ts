import { bot } from "../../../../FoxyLauncher";
import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { createActionRow, createCustomId, createSelectMenu } from "../../../../utils/discord/Component";

const RankSelectedExecutor = async (context: ComponentInteractionContext) => {
    const role = context.interaction.data.values[0];
    const [rank] = context.sentData;
    const guildInfo = await bot.database.getGuild(context.interaction.guildId);
    guildInfo.valAutoRoleModule[rank] = role;
    await guildInfo.save();
    context.sendReply({
        embeds: [{
            color: bot.colors.VALORANT,
            title: context.makeReply(bot.emotes.VALORANT_LOGO, bot.locale('commands:valorant.autorole.title')),
            description: bot.locale('commands:valorant.autorole.description'),
            fields: [{
                name: bot.locale('commands:valorant.autorole.ranks.unrated', { emoji: context.getEmojiById(bot.emotes.UNRATED) }),
                value: guildInfo.valAutoRoleModule.unratedRole ? `<@&${guildInfo.valAutoRoleModule.unratedRole}>` : bot.locale('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: bot.locale('commands:valorant.autorole.ranks.iron', { emoji: context.getEmojiById(bot.emotes.I3) }),
                value: guildInfo.valAutoRoleModule.ironRole ? `<@&${guildInfo.valAutoRoleModule.ironRole}>` : bot.locale('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: bot.locale('commands:valorant.autorole.ranks.bronze', { emoji: context.getEmojiById(bot.emotes.B3) }),
                value: guildInfo.valAutoRoleModule.bronzeRole ? `<@&${guildInfo.valAutoRoleModule.bronzeRole}>` : bot.locale('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: bot.locale('commands:valorant.autorole.ranks.silver', { emoji: context.getEmojiById(bot.emotes.S3) }),
                value: guildInfo.valAutoRoleModule.silverRole ? `<@&${guildInfo.valAutoRoleModule.silverRole}>` : bot.locale('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: bot.locale('commands:valorant.autorole.ranks.gold', { emoji: context.getEmojiById(bot.emotes.G3) }),
                value: guildInfo.valAutoRoleModule.goldRole ? `<@&${guildInfo.valAutoRoleModule.goldRole}>` : bot.locale('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: bot.locale('commands:valorant.autorole.ranks.platinum', { emoji: context.getEmojiById(bot.emotes.P3) }),
                value: guildInfo.valAutoRoleModule.platinumRole ? `<@&${guildInfo.valAutoRoleModule.platinumRole}>` : bot.locale('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: bot.locale('commands:valorant.autorole.ranks.diamond', { emoji: context.getEmojiById(bot.emotes.D3) }),
                value: guildInfo.valAutoRoleModule.diamondRole ? `<@&${guildInfo.valAutoRoleModule.diamondRole}>` : bot.locale('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: bot.locale('commands:valorant.autorole.ranks.ascendant', { emoji: context.getEmojiById(bot.emotes.A3) }),
                value: guildInfo.valAutoRoleModule.ascendantRole ? `<@&${guildInfo.valAutoRoleModule.ascendantRole}>` : bot.locale('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: bot.locale('commands:valorant.autorole.ranks.immortal', { emoji: context.getEmojiById(bot.emotes.IM3) }),
                value: guildInfo.valAutoRoleModule.immortalRole ? `<@&${guildInfo.valAutoRoleModule.immortalRole}>` : bot.locale('commands:valorant.autorole.ranks.none'),
                inline: true
            },
            {
                name: bot.locale('commands:valorant.autorole.ranks.radiant', { emoji: context.getEmojiById(bot.emotes.R) }),
                value: guildInfo.valAutoRoleModule.radiantRole ? `<@&${guildInfo.valAutoRoleModule.radiantRole}>` : bot.locale('commands:valorant.autorole.ranks.none'),
                inline: true
            }]
        }],
        components: [createActionRow([createSelectMenu({
            customId: createCustomId(2, context.author.id, context.commandId),
            placeholder: bot.locale('commands:valorant.autorole.rankSelectorPlaceholder'),
            options: [{
                label: bot.locale('commands:valorant.autorole.rankSelector.unrated'),
                value: 'unratedRole',
                emoji: {
                    id: bot.emotes.UNRATED
                },
                description: guildInfo.valAutoRoleModule.unratedRole ? bot.locale('commands:valorant.autorole.configured') : bot.locale('commands:valorant.autorole.ranks.none')
            },
            {
                label: bot.locale('commands:valorant.autorole.rankSelector.iron'),
                value: 'ironRole',
                emoji: {
                    id: bot.emotes.I3
                },
                description: guildInfo.valAutoRoleModule.ironRole ? bot.locale('commands:valorant.autorole.configured') : bot.locale('commands:valorant.autorole.ranks.none')
            },
            {
                label: bot.locale('commands:valorant.autorole.rankSelector.bronze'),
                value: 'bronzeRole',
                emoji: {
                    id: bot.emotes.B3
                },
                description: guildInfo.valAutoRoleModule.bronzeRole ? bot.locale('commands:valorant.autorole.configured') : bot.locale('commands:valorant.autorole.ranks.none')
            },
            {
                label: bot.locale('commands:valorant.autorole.rankSelector.silver'),
                value: 'silverRole',
                emoji: {
                    id: bot.emotes.S3
                },
                description: guildInfo.valAutoRoleModule.silverRole ? bot.locale('commands:valorant.autorole.configured') : bot.locale('commands:valorant.autorole.ranks.none')

            },
            {
                label: bot.locale('commands:valorant.autorole.rankSelector.gold'),
                value: 'goldRole',
                emoji: {
                    id: bot.emotes.G3
                },
                description: guildInfo.valAutoRoleModule.goldRole ? bot.locale('commands:valorant.autorole.configured') : bot.locale('commands:valorant.autorole.ranks.none')

            },
            {
                label: bot.locale('commands:valorant.autorole.rankSelector.platinum'),
                value: 'platinumRole',
                emoji: {
                    id: bot.emotes.P3
                },
                description: guildInfo.valAutoRoleModule.platinumRole ? bot.locale('commands:valorant.autorole.configured') : bot.locale('commands:valorant.autorole.ranks.none')
            },
            {
                label: bot.locale('commands:valorant.autorole.rankSelector.diamond'),
                value: 'diamondRole',
                emoji: {
                    id: bot.emotes.D3
                },
                description: guildInfo.valAutoRoleModule.diamondRole ? bot.locale('commands:valorant.autorole.configured') : bot.locale('commands:valorant.autorole.ranks.none')

            },
            {
                label: bot.locale('commands:valorant.autorole.rankSelector.ascendant'),
                value: 'ascendantRole',
                emoji: {
                    id: bot.emotes.A3
                },
                description: guildInfo.valAutoRoleModule.ascendantRole ? bot.locale('commands:valorant.autorole.configured') : bot.locale('commands:valorant.autorole.ranks.none')
            },
            {
                label: bot.locale('commands:valorant.autorole.rankSelector.immortal'),
                value: 'immortalRole',
                emoji: {
                    id: bot.emotes.IM3
                },
                description: guildInfo.valAutoRoleModule.immortalRole ? bot.locale('commands:valorant.autorole.configured') : bot.locale('commands:valorant.autorole.ranks.none')
            },
            {
                label: bot.locale('commands:valorant.autorole.rankSelector.radiant'),
                value: 'radiantRole',
                emoji: {
                    id: bot.emotes.R
                },
                description: guildInfo.valAutoRoleModule.radiantRole ? bot.locale('commands:valorant.autorole.configured') : bot.locale('commands:valorant.autorole.ranks.none')
            }]
        })])]
    })
}

export default RankSelectedExecutor;