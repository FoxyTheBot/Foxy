import { User } from "discordeno/transformers";
import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { ValUser } from "../../../structures/types/valuser";
import RenderValorantProfile from "../../../utils/commands/generators/RenderValorantProfile";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

export default async function executeValorantStatsCommand(bot, context: ChatInputInteractionContext, endCommand, t) {
    const user = context.getOption<User>('user', 'users') ?? context.author;
    const mode = context.getOption<string>('mode', false) ?? "competitive";

    const userData = await bot.database.getUser(user.id);
    if (!userData.riotAccount.isLinked) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:profile.val.notLinked', { user: await bot.foxyRest.getUserDisplayName(user.id) }))
        });
        return endCommand();
    }

    if (userData.riotAccount.isPrivate && context.author.id !== user.id) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:profile.val.private', { user: await bot.foxyRest.getUserDisplayName(user.id) }))
        });
        return endCommand();
    }

    context.sendReply({
        embeds: [{
            color: 0xf84354,
            title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.loadingTitle')),
            description: t('commands:valorant.loadingDescription')
        }]
    });

    const userInfo: ValUser = await bot.foxyRest.getValPlayerByUUID(await userData.riotAccount.puuid);
    const mmrInfo = await bot.foxyRest.getMMR(await userData.riotAccount.puuid);

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
    const highestRank = getRank(mmrInfo.data.highest_rank.patched_tier ?? "Unrated");

    let matches = await bot.foxyRest.getAllValMatchHistoryByUUID(await userData.riotAccount.puuid, mode.replace(" ", "").toLowerCase());
    if (!matches) matches = await bot.foxyRest.getAllValMatchHistoryByUUID(await userData.riotAccount.puuid, "unrated");
    const formattedRank = rank ? `${t(`commands:valorant.player.ranks.${rank.rank}`)}` : `${t('commands:valorant.player.ranks.UNRATED')}`;
    const formattedHighestRank = highestRank ? `${t(`commands:valorant.player.ranks.${highestRank.rank}`)} (${mmrInfo.data.highest_rank.season
        .toUpperCase()
        .match(/.{1,2}/g)
        .join(':')})` : `${t('commands:valorant.player.ranks.UNRATED')}`;
    const characterCounts = {};
    const mapCounts = {};

    let mostPlayedCharacter = 'FOXY_SHRUG';
    let mostPlayedMap = 'FOXY_SHRUG';
    let maxCharacterCount = 0;
    let maxMapCount = 0;
    let currentRR;
    let formattedRR = mmrInfo.data.current_data.mmr_change_to_last_game;

    if (formattedRR > 0) {
        formattedRR = `+${formattedRR}`;
    }

    let totalKills = 0,
        totalDeaths = 0,
        totalAssists = 0,
        killsPercentage = 0,
        deathsPercentage = 0,
        assistsPercentage = 0,
        headshotsPercentage = 0,
        bodyshotsPercentage = 0,
        legshotsPercentage = 0,
        headshots = 0,
        bodyshots = 0,
        legshots = 0;

    matches.data.forEach((match) => {
        const characterName = match.stats.character.name || 'FOXY_SHRUG';
        const mapName = match.meta.map.name || 'FOXY_SHRUG';
        if (characterCounts[characterName]) {
            characterCounts[characterName]++;
        } else {
            characterCounts[characterName] = 1;
        }

        if (match.meta.season.short !== "e8a2") return;
        if (characterCounts[characterName] > maxCharacterCount) {
            mostPlayedCharacter = characterName;
            if (mostPlayedCharacter === "KAY/O") mostPlayedCharacter = "KAYO";
            maxCharacterCount = characterCounts[characterName];
        }

        if (mapCounts[mapName]) {
            mapCounts[mapName]++;
        } else {
            mapCounts[mapName] = 1;
        }

        if (mapCounts[mapName] > maxMapCount) {
            mostPlayedMap = mapName;
            maxMapCount = mapCounts[mapName];
        }

        headshots += match.stats.shots.head;
        bodyshots += match.stats.shots.body;
        legshots += match.stats.shots.leg;
        totalKills += match.stats.kills;
        totalDeaths += match.stats.deaths;
        totalAssists += match.stats.assists;
    });

    if (!matches.data.length) {
        context.sendReply({
            embeds: [{
                color: 0xf84354,
                title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.cannotGetInfo')),
                description: t('commands:valorant.noMatchesFound', { mode: t(`commands:valorant.matchMode.${mode}`) })
            }]
        });
        return endCommand();
    }
    let totalMatches = matches.data.length;
    killsPercentage = (totalKills / (totalKills + totalDeaths)) * 100;
    deathsPercentage = (totalDeaths / (totalKills + totalDeaths)) * 100;
    assistsPercentage = (totalAssists / (totalKills + totalDeaths)) * 100;
    headshotsPercentage = (headshots / (headshots + bodyshots + legshots)) * 100;
    bodyshotsPercentage = (bodyshots / (headshots + bodyshots + legshots)) * 100;
    legshotsPercentage = (legshots / (headshots + bodyshots + legshots)) * 100;

    const embed = {
        color: 0xf84354,
        title: context.getEmojiById(bot.emotes.VALORANT_LOGO) + " " + t('commands:valorant.player.title', { username: userInfo.data.name, tag: userInfo.data.tag, rank: `${context.getEmojiById(rank.emoji)} ${formattedRank}` }),
        fields: [
            {
                name: t('commands:valorant.player.level'),
                value: `\`\`\`${userInfo.data.account_level}\`\`\``,
                inline: true
            },
            {
                name: t('commands:valorant.player.mostPlayedMap'),
                value: `\`\`\`${mostPlayedMap}\`\`\``,
                inline: true
            }],
        image: {
            url: 'attachment://profile.png'
        },
        thumbnail: {
            url: userInfo.data.card.small
        }
    }
    const patchedRank = mmrInfo.data.current_data.currenttierpatched;
    const patchedHighestRank = mmrInfo.data.highest_rank.patched_tier;
    if (userInfo.status === 200) {
        const valorantProfile = new RenderValorantProfile(user);
        const profileImage = await valorantProfile.render({
            userInfo,
            headshotsPercentage,
            bodyshotsPercentage,
            legshotsPercentage,
            headshots,
            bodyshots,
            legshots,
            killsPercentage,
            deathsPercentage,
            assistsPercentage,
            totalKills,
            totalDeaths,
            totalAssists,
            mostPlayedCharacter,
            totalMatches,
            formattedRank,
            formattedHighestRank,
            patchedRank,
            patchedHighestRank
        });

        if (mmrInfo.data.current_data.ranking_in_tier !== null) {
            embed.fields.push({
                name: t('commands:valorant.player.currentRR'),
                value: `\`\`\`${await mmrInfo.data.current_data.ranking_in_tier}/100 (${formattedRR} ${t('commands:valorant.player.lastgame')})\`\`\``,
                inline: false
            })
        }

        context.sendReply({
            embeds: [embed],
            file: {
                blob: await profileImage,
                name: 'profile.png'
            },
            components: [createActionRow([createButton({
                label: t('commands:valorant.player.viewMatches'),
                style: 1,
                customId: createCustomId(1, context.author.id, context.commandId, user.id),
                emoji: {
                    id: bot.emotes.VALORANT_LOGO
                }
            })
            ])]
        });
        return endCommand();
    } else {
        context.sendReply({
            embeds: [{
                color: 0xf84354,
                title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.cannotGetInfo')),
                description: t('commands:valorant.noUser')
            }]
        });
        return endCommand();
    }
}