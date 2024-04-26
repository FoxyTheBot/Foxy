import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createEmbed } from "../../../../utils/discord/Embed";

const ValMatchSelectorExecutor = async (context: ComponentInteractionContext) => {
    context.sendDefer();

    const matchId = context.interaction.data.values[0];
    const [userPUUID] = context.sentData;
    const match = await bot.foxyRest.getValMatch(matchId);
    const matchInfo = match.data;

    function getRank(rank: string) {
        const rankMapping: { [key: string]: any } = {
            'Iron 1': { rank: 'I1', emoji: bot.emotes.I1 },
            'Iron 2': { rank: 'I2', emoji: bot.emotes.I2 },
            'Iron 3': { rank: 'I3', emoji: bot.emotes.I3 },
            'Bronze 1': { rank: 'B1', emoji: bot.emotes.B1 },
            'Bronze 2': { rank: 'B2', emoji: bot.emotes.B2 },
            'Bronze 3': { rank: 'B3', emoji: bot.emotes.B3 },
            'Silver 1': { rank: 'S1', emoji: bot.emotes.S1 },
            'Silver 2': { rank: 'S2', emoji: bot.emotes.S2 },
            'Silver 3': { rank: 'S3', emoji: bot.emotes.S3 },
            'Gold 1': { rank: 'G1', emoji: bot.emotes.G1 },
            'Gold 2': { rank: 'G2', emoji: bot.emotes.G2 },
            'Gold 3': { rank: 'G3', emoji: bot.emotes.G3 },
            'Platinum 1': { rank: 'P1', emoji: bot.emotes.P1 },
            'Platinum 2': { rank: 'P2', emoji: bot.emotes.P2 },
            'Platinum 3': { rank: 'P3', emoji: bot.emotes.P3 },
            'Diamond 1': { rank: 'D1', emoji: bot.emotes.D1 },
            'Diamond 2': { rank: 'D2', emoji: bot.emotes.D2 },
            'Diamond 3': { rank: 'D3', emoji: bot.emotes.D3 },
            'Ascendant 1': { rank: 'A1', emoji: bot.emotes.A1 },
            'Ascendant 2': { rank: 'A2', emoji: bot.emotes.A2 },
            'Ascendant 3': { rank: 'A3', emoji: bot.emotes.A3 },
            'Immortal 1': { rank: 'IM1', emoji: bot.emotes.IM1 },
            'Immortal 2': { rank: 'IM2', emoji: bot.emotes.IM2 },
            'Immortal 3': { rank: 'IM3', emoji: bot.emotes.IM3 },
            'Radiant': { rank: 'R', emoji: bot.emotes.R },
        };

        if (rank in rankMapping) {
            return rankMapping[rank];
        } else {
            return null;
        }
    }
    const userStats = matchInfo.players.all_players.find(player => player.puuid === userPUUID);

    var fields;
    if (matchInfo.metadata.mode === 'Deathmatch') {
        fields = matchInfo.players.all_players.map(player => {
            const rank = getRank(player.currenttier_patched);
            const formattedRank = rank ? `${context.getEmojiById(rank.emoji)} ${bot.locale(`commands:valorant.player.ranks.${rank.rank}`)}` : `${context.getEmojiById(bot.emotes.UNRATED)} ${bot.locale('commands:valorant.player.ranks.UNRATED')}`;
            return {
                name: `${player.name}#${player.tag} - Level ${player.level}`,
                value: `${bot.locale('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[player.character.toUpperCase()])}` +
                    `\nScore: ${player.stats.score}` +
                    `\nKDA: ${player.stats.kills}/${player.stats.deaths}/${player.stats.assists}` +
                    `\nRank: ${formattedRank}`,

                inline: true
            }
        });
    } else {
        fields = [{
            name: "K/D/A",
            value: `\`\`\`${userStats.stats.kills}/${userStats.stats.deaths}/${userStats.stats.assists}\`\`\``,
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.economy.average'),
            value: `\`\`\`${userStats.economy.spent.average.toString()} CR\`\`\``,
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.economy.overall'),
            value: `\`\`\`${userStats.economy.spent.overall.toString()} CR\`\`\``,
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.roundsAFK'),
            value: userStats.behavior.afk_rounds.toString(),
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.score'),
            value: userStats.stats.score.toString(),
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.bodyshots'),
            value: userStats.stats.bodyshots.toString(),
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.headshots'),
            value: userStats.stats.headshots.toString(),
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.damageReceived'),
            value: userStats.damage_received.toString(),
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.damageMade'),
            value: userStats.damage_made.toString(),
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.legshots'),
            value: userStats.stats.legshots.toString(),
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.abilityCasts.c'),
            value: userStats.ability_casts.c_cast.toString() ?? "0",
            inline: true,
        }, {
            name: bot.locale('commands:valorant.match.abilityCasts.q'),
            value: userStats.ability_casts.q_cast.toString() ?? "0",
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.abilityCasts.e'),
            value: userStats.ability_casts.e_cast.toString() ?? "0",
            inline: true,
        },
        {
            name: bot.locale('commands:valorant.match.abilityCasts.x'),
            value: userStats.ability_casts.x_cast.toString()?? "0",
            inline: true,
        }];
    }

    const embed = createEmbed({
        color: 0xf84354,
        description: `**${bot.locale('commands:valorant.match.map')}:** ${matchInfo.metadata.map}` +
            `\n**${bot.locale('commands:valorant.match.mode')}:** ${bot.locale(`commands:valorant.match.modes.${matchInfo.metadata.mode.toLowerCase()}`)}` +
            `\n**${bot.locale('commands:valorant.match.rounds')}:** ${matchInfo.metadata.rounds_played}` +
            `\n**Cluster:** ${matchInfo.metadata.cluster}` +
            `\n**${bot.locale('commands:valorant.match.startedAt')}:** <t:${matchInfo.metadata.game_start}:F>`,
        thumbnail: {
            url: userStats.assets.agent.small
        },
        fields: fields
    })

    context.sendReply({
        embeds: [embed]
    });
}

export default ValMatchSelectorExecutor;