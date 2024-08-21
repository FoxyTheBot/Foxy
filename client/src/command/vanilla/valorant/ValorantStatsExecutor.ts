import { User } from "discordeno/transformers";
import RenderValorantProfile from "../../../utils/images/generators/RenderValorantProfile";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { colors } from "../../../utils/colors";
import { FoxyClient } from "../../../structures/types/FoxyClient";
import { getRank } from "./utils/getRank";

export default async function ValorantStatsExecutor(bot: FoxyClient, context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>('user', 'users') ?? context.author;
    const mode = context.getOption<string>('mode', false);
    const userData = await bot.database.getUser(user.id);
    
    context.sendDefer(userData.riotAccount.isPrivate);
    
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

    const userInfo = await bot.rest.foxy.getValPlayerByUUID(await userData.riotAccount.puuid);
    if (!userInfo.data.card) {
        // When a user has not played for a long time, the API returns their cardless information
        return context.sendReply({
            embeds: [{
                color: colors.RED,
                title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.cannotGetInfo')),
                description: t('commands:valorant.cannotGetInfoDescription')
            }]
        });
    }

    const mmrInfo = await bot.rest.foxy.getMMR(await userData.riotAccount.puuid);


    const rank = getRank(mmrInfo.data.current_data.currenttierpatched ?? "Unrated");
    const highestRank = getRank(mmrInfo.data.highest_rank.patched_tier ?? "Unrated");

    let matches = await bot.rest.foxy.getAllValMatchHistoryByUUID(await userData.riotAccount.puuid, mode ?? "competitive");
    if (!matches) matches = await bot.rest.foxy.getAllValMatchHistoryByUUID(await userData.riotAccount.puuid, "unrated");
    const formattedRank = rank ? `${t(`commands:valorant.player.ranks.${rank.rank}`)}` : `${t('commands:valorant.player.ranks.UNRATED')}`;
    const formattedHighestRank = highestRank ? `${t(`commands:valorant.player.ranks.${highestRank.rank}`)} (${mmrInfo.data.highest_rank.season
        .toUpperCase()
        .match(/.{1,2}/g)
        .join(':')})` : `${t('commands:valorant.player.ranks.UNRATED')}`;
    const characterCounts = {};
    const mapCounts = {};

    let mostPlayedCharacter = 'FOXY_SHRUG';
    let mostPlayedMap = t('commands:valorant.player.unknownMap');
    let maxCharacterCount = 0;
    let maxMapCount = 0;
    let formattedRR: any = mmrInfo.data.current_data.mmr_change_to_last_game;

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
    matches.data.map((match) => {
        if (match.meta.season.short !== "e9a1") return;
        const currentPlayer = match.stats
        const characterName = currentPlayer.character.name || "FOXY_SHRUG";
        const mapName = match.meta.map.name || t('commands:valorant.unknownMap');
        if (characterCounts[characterName]) {
            characterCounts[characterName]++;
        } else {
            characterCounts[characterName] = 1;
        }

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

        headshots += currentPlayer.shots.head;
        bodyshots += currentPlayer.shots.body;
        legshots += currentPlayer.shots.leg;
        totalKills += currentPlayer.kills;
        totalDeaths += currentPlayer.deaths;
        totalAssists += currentPlayer.assists;
    });

    if (!matches.data.length) {
        context.sendReply({
            embeds: [{
                color: bot.colors.RED,
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
    headshotsPercentage = isNaN((headshots / (headshots + bodyshots + legshots)) * 100) ? 0 : (headshots / (headshots + bodyshots + legshots)) * 100
    bodyshotsPercentage = isNaN((bodyshots / (headshots + bodyshots + legshots)) * 100) ? 0 : (bodyshots / (headshots + bodyshots + legshots)) * 100
    legshotsPercentage = isNaN((legshots / (headshots + bodyshots + legshots)) * 100) ? 0 : (legshots / (headshots + bodyshots + legshots)) * 100

    const embed = {
        color: bot.colors.VALORANT,
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
                    id: BigInt(bot.emotes.VALORANT_LOGO)
                }
            })
            ])]
        });
        return endCommand();
    } else {
        context.sendReply({
            embeds: [{
                color: bot.colors.VALORANT,
                title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.cannotGetInfo')),
                description: t('commands:valorant.noUser')
            }]
        });
        return endCommand();
    }
}