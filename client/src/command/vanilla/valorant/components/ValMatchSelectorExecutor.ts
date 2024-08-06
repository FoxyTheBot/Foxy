import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { createEmbed } from "../../../../utils/discord/Embed";
import { getRank } from "../utils/getRank";

const ValMatchSelectorExecutor = async (context: ComponentInteractionContext) => {
    const matchId = context.interaction.data.values[0];
    const [userPUUID] = context.sentData;
    const match = await bot.rest.foxy.getValMatch(matchId);
    const userData = await bot.database.getUser(context.author.id);
    const matchInfo = match.data;
    context.sendDefer(userData.riotAccount.isPrivate);

    const userStats = matchInfo.players.all_players.find(player => player.puuid === userPUUID);

    var fields;
    if (matchInfo.metadata.mode === 'Deathmatch') {
        fields = matchInfo.players.all_players.map(player => {
            const rank = getRank(player.currenttierpatched);
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
        color: bot.colors.VALORANT,
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