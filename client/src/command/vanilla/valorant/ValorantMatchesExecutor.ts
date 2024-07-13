import { User } from "discordeno/transformers";
import { createEmbed } from "../../../utils/discord/Embed";
import { createActionRow, createCustomId, createSelectMenu } from "../../../utils/discord/Component";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { FoxyClient } from "../../../structures/types/foxy";
import { MatchHistory } from "../../../structures/types/valorant/MatchHistory";

export default async function ValorantMatchesExecutor(bot: FoxyClient, context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>('user', 'users') ?? context.author;
    const userData = await bot.database.getUser(user.id);
    if (!userData.riotAccount.isLinked) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:profile.val.notLinked', { user: await bot.rest.foxy.getUserDisplayName(user.id) }))
        });
        return endCommand();
    }

    if (userData.riotAccount.isPrivate && context.author.id !== user.id) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:profile.val.private', { user: await bot.rest.foxy.getUserDisplayName(user.id) }))
        });
        return endCommand();
    }

    context.sendReply({
        embeds: [{
            color: bot.colors.VALORANT,
            title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.loadingTitle')),
            description: t('commands:valorant.loadingDescription')
        }]
    });

    const matchInfo: MatchHistory = await bot.rest.foxy.getValMatchHistoryByUUID(userData.riotAccount.puuid, context.getOption<string>('mode', false) ?? null, context.getOption<string>('map', false) ?? null);
    const valUserInfo = await bot.rest.foxy.getValPlayerByUUID(userData.riotAccount.puuid);
    const mmrInfo = await bot.rest.foxy.getMMR(await userData.riotAccount.puuid);

    function getRank(rank: string) {
        const rankMapping: { [key: string]: any } = {
            'Unrated': { rank: 'UNRATED', emoji: bot.emotes.UNRATED },
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

    const rank = getRank(mmrInfo.data.current_data.currenttierpatched ?? "Unrated");
    const formattedRank = rank ? `${context.getEmojiById(rank.emoji)} ${t(`commands:valorant.player.ranks.${rank.rank}`)}` : `${context.getEmojiById(bot.emotes.UNRATED)} ${t('commands:valorant.player.ranks.UNRATED')}`;
    
    try {
        const embed = createEmbed({
            color: bot.colors.VALORANT,
            thumbnail: {
                url: valUserInfo.data.card.small
            },
            title: context.getEmojiById(bot.emotes.VALORANT_LOGO) + " " + t('commands:valorant.match.title', { username: valUserInfo.data.name, tag: valUserInfo.data.tag }) + ` - ${formattedRank}`,
            fields: matchInfo.data.map(match => {
                const currentPlayer = match.players.find(player => player.puuid === userData.riotAccount.puuid);
                let teamHasWon = match.teams[0].won ? "Red" : "Blue" || "Draw";
                let result = context.getEmojiById(bot.emotes.FOXY_RAGE) + " " + t('commands:valorant.match.draw');

                if (teamHasWon !== "Draw") {
                    if (currentPlayer.team_id === teamHasWon) {
                        result = context.getEmojiById(bot.emotes.FOXY_YAY) + " " + t('commands:valorant.match.win');
                    } else {
                        result = context.getEmojiById(bot.emotes.FOXY_CRY) + " " + t('commands:valorant.match.loss');
                    }
                }


                if (match.metadata.queue.id.toLowerCase() !== "deathmatch") {
                    return {
                        name: `${match.metadata.map.name} | ${bot.locale(`commands:valorant.match.modes.${match.metadata.queue.id.toLowerCase()}`)} | ${match.teams[0].rounds.won ?? 0} - ${match.teams[1].rounds.won ?? 0} | ${result}`,
                        value: `${t('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[currentPlayer.agent.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \n` +
                            `K/D/A: ${currentPlayer.stats.kills}/${currentPlayer.stats.deaths}/${currentPlayer.stats.assists} \n` +
                            `Score: ${currentPlayer.stats.score} \n` +
                            `${t('commands:valorant.match.damageMade')}: ${currentPlayer.stats.damage.dealt} \n` +
                            `${t('commands:valorant.match.damageReceived')}: ${currentPlayer.stats.damage.received} \n`,
                        inline: true
                    }
                } else {
                    return {
                        name: `${match.metadata.map.name} - ${bot.locale(`commands:valorant.match.modes.${match.metadata.queue.id.toLowerCase()}`)}`,
                        value: `${t('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[currentPlayer.agent.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \n` +
                            `K/D/A: ${currentPlayer.stats.kills}/${currentPlayer.stats.deaths}/${currentPlayer.stats.assists} \n` +
                            `Score: ${currentPlayer.stats.score}`,
                        inline: true
                    }
                }
            }),
            footer: {
                text: t("commands:valorant.match.footer")
            }
        });

        let row;

        if (matchInfo.data.length !== 0) {
            row = createActionRow([createSelectMenu({
                customId: createCustomId(0, context.author.id, context.commandId, await userData.riotAccount.puuid),
                placeholder: t('commands:valorant.match.placeholder'),
                options: matchInfo.data.map(match => {
                    const currentPlayer = match.players.find(player => player.puuid === userData.riotAccount.puuid);
                    return {
                        label: `${match.metadata.map.name} - ${bot.locale(`commands:valorant.match.modes.${match.metadata.queue.id.toLowerCase()}`)}`,
                        value: match.metadata.match_id,
                        description: `${currentPlayer.agent.name} | K/D/A: ${currentPlayer.stats.kills}/${currentPlayer.stats.deaths}/${currentPlayer.stats.assists}`,
                        emoji: {
                            id: bot.emotes[currentPlayer.agent.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG]
                        }
                    }
                })
            })])
        } else {
            embed.description = t('commands:valorant.match.noMatchesDescription');
            row = createActionRow([createSelectMenu({
                customId: createCustomId(0, context.author.id, context.commandId, await userData.riotAccount.puuid),
                placeholder: t('commands:valorant.match.noMatches'),
                disabled: true,
                options: [{
                    label: t('commands:valorant.match.noMatches'),
                    value: 'noMatches',
                    description: t('commands:valorant.match.noMatchesDescription')
                }]
            })])

        }
        context.sendReply({
            embeds: [embed],
            components: [row]
        });
        return endCommand();
    } catch (err) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:valorant.match.notFound'))
        });
        return endCommand();
    }
}