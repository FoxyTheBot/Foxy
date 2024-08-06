import { User } from "discordeno/transformers";
import { createEmbed } from "../../../utils/discord/Embed";
import { createActionRow, createCustomId, createSelectMenu } from "../../../utils/discord/Component";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { FoxyClient } from "../../../structures/types/foxy";
import { MatchHistory } from "../../../structures/types/valorant/MatchHistory";
import { colors } from "../../../utils/colors";
import { getRank } from "./utils/getRank";

export default async function ValorantMatchesExecutor(bot: FoxyClient, context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>('user', 'users') ?? context.author;
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

    const matchInfo = await bot.rest.foxy.getValMatchHistoryByUUID(userData.riotAccount.puuid, context.getOption<string>('mode', false) ?? null, context.getOption<string>('map', false) ?? null);
    const valUserInfo = await bot.rest.foxy.getValPlayerByUUID(userData.riotAccount.puuid);
    if (!valUserInfo) {
        return context.sendReply({
            embeds: [{
                color: colors.RED,
                title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.cannotGetInfo')),
                description: t('commands:valorant.cannotGetInfoDescription')
            }]
        }).finally(endCommand);
    }
    const mmrInfo = await bot.rest.foxy.getMMR(await userData.riotAccount.puuid);

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
                const currentPlayer = match.stats;
                let teamHasWon = match.teams[0].won ? "Red" : "Blue" || "Draw";
                let result = context.getEmojiById(bot.emotes.FOXY_RAGE) + " " + t('commands:valorant.match.draw');

                if (teamHasWon !== "Draw") {
                    if (currentPlayer.team === teamHasWon) {
                        result = context.getEmojiById(bot.emotes.FOXY_YAY) + " " + t('commands:valorant.match.win');
                    } else {
                        result = context.getEmojiById(bot.emotes.FOXY_CRY) + " " + t('commands:valorant.match.loss');
                    }
                }


                if (match.meta.mode.toLowerCase() !== "deathmatch") {
                    return {
                        name: `${match.meta.map.name} | ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)} | ${match.teams[0].rounds.won ?? 0} - ${match.teams[1].rounds.won ?? 0} | ${result}`,
                        value: `${t('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[currentPlayer.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \n` +
                            `K/D/A: ${currentPlayer.kills}/${currentPlayer.deaths}/${currentPlayer.assists} \n` +
                            `Score: ${currentPlayer.score} \n`,
                        inline: true
                    }
                } else {
                    return {
                        name: `${match.meta.map.name} - ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)}`,
                        value: `${t('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[currentPlayer.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \n` +
                            `K/D/A: ${currentPlayer.kills}/${currentPlayer.deaths}/${currentPlayer.assists} \n` +
                            `Score: ${currentPlayer.score}`,
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
                    const currentPlayer = match.stats;
                    return {
                        label: `${match.meta.map.name} - ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)}`,
                        value: match.meta.id,
                        description: `${currentPlayer.character} | K/D/A: ${currentPlayer.kills}/${currentPlayer.deaths}/${currentPlayer.assists}`,
                        emoji: {
                            id: bot.emotes[currentPlayer.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG]
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
            components: [row],
        });
        return endCommand();
    } catch (err) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:valorant.match.notFound'))
        });
        return endCommand();
    }
}