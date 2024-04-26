import { User } from "discordeno/transformers";
import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { createEmbed } from "../../../utils/discord/Embed";
import { createActionRow, createCustomId, createSelectMenu } from "../../../utils/discord/Component";

export default async function ValorantMatchesExecutor(bot, context: ChatInputInteractionContext, endCommand, t) {
    const user = context.getOption<User>('user', 'users') ?? context.author;
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

    const matchInfo: any = await bot.foxyRest.getValMatchHistoryByUUID(userData.riotAccount.puuid, context.getOption<string>('mode', false), context.getOption<string>('map', false));
    const valUserInfo = await bot.foxyRest.getValPlayerByUUID(userData.riotAccount.puuid);

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
    const formattedRank = rank ? `${context.getEmojiById(rank.emoji)} ${t(`commands:valorant.player.ranks.${rank.rank}`)}` : `${context.getEmojiById(bot.emotes.UNRATED)} ${t('commands:valorant.player.ranks.UNRATED')}`;

    try {
        const embed = createEmbed({
            color: 0xf84354,
            thumbnail: {
                url: valUserInfo.data.card.small
            },
            title: context.getEmojiById(bot.emotes.VALORANT_LOGO) + " " + t('commands:valorant.match.title', { username: valUserInfo.data.name, tag: valUserInfo.data.tag }) + ` - ${formattedRank}`,
            fields: matchInfo.data.map(match => {
                let teamHasWon;
                let result;
                if (match.teams.red > match.teams.blue) {
                    teamHasWon = "Red";
                } else if (match.teams.red < match.teams.blue) {
                    teamHasWon = "Blue";
                } else {
                    teamHasWon = "Draw";
                    result = context.getEmojiById(bot.emotes.FOXY_RAGE) + " " + t('commands:valorant.match.draw');
                }

                if (teamHasWon !== "Draw") {
                    if (match.stats.team === teamHasWon) {
                        result = context.getEmojiById(bot.emotes.FOXY_YAY) + " " + t('commands:valorant.match.win');
                    } else {
                        result = context.getEmojiById(bot.emotes.FOXY_CRY) + " " + t('commands:valorant.match.loss');
                    }
                }


                if (match.meta.mode.toLowerCase() !== "deathmatch") {
                    return {
                        name: `${match.meta.map.name} | ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)} | ${match.teams.red ?? 0} - ${match.teams.blue ?? 0} | ${result}`,
                        value: `${t('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[match.stats.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \n` +
                            `K/D/A: ${match.stats.kills}/${match.stats.deaths}/${match.stats.assists} \n` +
                            `Score: ${match.stats.score} \n` +
                            `${t('commands:valorant.match.damageMade')}: ${match.stats.damage.made} \n` +
                            `${t('commands:valorant.match.damageReceived')}: ${match.stats.damage.received} \n`,
                        inline: true
                    }
                } else {
                    return {
                        name: `${match.meta.map.name} - ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)}`,
                        value: `${t('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[match.stats.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \n` +
                            `K/D/A: ${match.stats.kills}/${match.stats.deaths}/${match.stats.assists} \n` +
                            `Score: ${match.stats.score}`,
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
                    return {
                        label: `${match.meta.map.name} - ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)}`,
                        value: match.meta.id,
                        description: `${match.stats.character.name} | K/D/A: ${match.stats.kills}/${match.stats.deaths}/${match.stats.assists}`,
                        emoji: {
                            id: bot.emotes[match.stats.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG]
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