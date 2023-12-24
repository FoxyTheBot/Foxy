import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { bot } from '../../index';
import { createCommand } from '../../structures/commands/createCommand';
import { User } from 'discordeno/transformers';
import CreateProfile from '../../utils/commands/generators/GenerateProfile';
import { createEmbed } from '../../utils/discord/Embed';
import { ValUser } from '../../structures/types/valuser';
import { createActionRow, createButton, createCustomId } from '../../utils/discord/Component';
import ViewMatchHistory from '../../utils/commands/executors/valorant/viewMatchHistoryExecutor';

const ProfileCommand = createCommand({
    name: 'profile',
    nameLocalizations: { 'pt-BR': 'perfil' },
    description: '[Social] View your profile or another user profile',
    descriptionLocalizations: { 'pt-BR': '[Social] Veja seu perfil ou o de outro usuário' },
    category: 'social',
    options: [{
        name: "view",
        nameLocalizations: {
            "pt-BR": "ver"
        },
        description: "[Social] View your profile or another user profile",
        descriptionLocalizations: { 'pt-BR': '[Social] Veja o seu perfil ou de outro usuário' },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: 'user',
            description: 'User to view the profile',
            descriptionLocalizations: { 'pt-BR': 'Usuário para ver o perfil' },
            type: ApplicationCommandOptionTypes.User,
            required: false
        }]
    },
    {
        name: "valorant",
        description: "View your VALORANT profile",
        descriptionLocalizations: { 'pt-BR': '[VALORANT] Veja seu perfil do VALORANT' },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: 'user',
            description: 'User to view the profile',
            descriptionLocalizations: { 'pt-BR': '[VALORANT] Usuário para ver o perfil' },
            type: ApplicationCommandOptionTypes.User,
            required: false
        }]
    }],
    commandRelatedExecutions: [ViewMatchHistory],
    execute: async (context, endCommand, t) => {
        const subcommand = context.getSubCommand();

        switch (subcommand) {
            case 'view': {
                const user = context.getOption<User>('user', 'users') ?? context.author;
                const userData = await bot.database.getUser(user.id);

                if (userData.isBanned) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_RAGE, t('commands:profile.banned', { user: await bot.foxyRest.getUserDisplayName(user.id), reason: userData.banReason, date: userData.banData.toLocaleString(global.t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }))
                    });
                    return endCommand();
                }

                await context.sendDefer();
                const createProfile = new CreateProfile(t, user, userData);
                const profile = createProfile.create();

                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_NICE, t('commands:profile.profile', { user: `<@${user.id}>` })),
                    file: [{ name: 'profile.png', blob: await profile }]
                })
                return endCommand();
            }

            case 'valorant': {
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

                context.sendDefer();
                const userInfo: ValUser = await bot.foxyRest.getValPlayerByUUID(await userData.riotAccount.puuid);
                const mmrInfo = await bot.foxyRest.getMMR(await userData.riotAccount.puuid);

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

                const rank = getRank(mmrInfo.data.current_data.currenttierpatched);
                const matches = await bot.foxyRest.getAllValMatchHistoryByUUID(await userData.riotAccount.puuid);
                const formattedRank = rank ? `${context.getEmojiById(rank.emoji)} ${t(`commands:valorant.player.ranks.${rank.rank}`)}` : `${context.getEmojiById(bot.emotes.UNRATED)} ${t('commands:valorant.player.ranks.UNRATED')}`;
                const characterCounts = {};

                let mostPlayedCharacter = 'FOXY_SHRUG';
                let maxCount = 0;
                let totalKills = 0;
                let totalDeaths = 0;
                let totalAssists = 0;

                matches.data.forEach(match => {
                    const characterName = match.stats.character.name || 'FOXY_SHRUG';

                    if (characterCounts[characterName]) {
                        characterCounts[characterName]++;
                    } else {
                        characterCounts[characterName] = 1;
                    }

                    if (characterCounts[characterName] > maxCount) {
                        mostPlayedCharacter = characterName;
                        maxCount = characterCounts[characterName];
                    }

                    totalKills += match.stats.kills;
                    totalDeaths += match.stats.deaths;
                    totalAssists += match.stats.assists;
                });


                if (userInfo.status === 200) {
                    const embed = createEmbed({
                        color: 0xf84355,
                        title: context.getEmojiById(bot.emotes.VALORANT_LOGO) + " " + t('commands:valorant.player.title', { username: userInfo.data.name, tag: userInfo.data.tag }),
                        image: {
                            url: userInfo.data.card.wide
                        },
                        thumbnail: {
                            url: userInfo.data.card.small
                        },
                        fields: [{
                            name: t('commands:valorant.player.level'),
                            value: userInfo.data.account_level.toString(),
                            inline: true
                        },
                        {
                            name: t('commands:valorant.player.rank'),
                            value: formattedRank,
                            inline: true
                        },
                        {
                            name: t('commands:valorant.player.mostPlayedAgent'),
                            value: `${context.getEmojiById(bot.emotes[mostPlayedCharacter.toUpperCase()])} ${mostPlayedCharacter}`,
                            inline: true
                        },
                        {
                            name: t('commands:valorant.player.kills'),
                            value: totalKills.toString(),
                            inline: true
                        },
                        {
                            name: t('commands:valorant.player.deaths'),
                            value: totalDeaths.toString(),
                            inline: true
                        },
                        {
                            name: t('commands:valorant.player.assists'),
                            value: totalAssists.toString(),
                            inline: true
                        }]
                    })

                    context.sendReply({
                        embeds: [embed],
                        components: [createActionRow([createButton({
                            label: t('commands:valorant.player.viewMatches'),
                            style: 1,
                            customId: createCustomId(0, context.author.id, context.commandId, user.id),
                            emoji: {
                                id: bot.emotes.VALORANT_LOGO
                            }
                        })])]
                    });
                    return endCommand();
                } else {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:valorant.player.notFound'))
                    });
                    return endCommand();
                }
            }
        }
    }
});

export default ProfileCommand;