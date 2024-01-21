import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { bot } from "../../index";
import { createActionRow, createButton, createCustomId, createSelectMenu } from "../../utils/discord/Component";
import ValMatchSelectorExecutor from "../../utils/commands/executors/valorant/ValMatchSelectorExecutor";
import { MessageFlags } from "../../utils/discord/Message";
import { User } from "discordeno/transformers";
import { ValUser } from "../../structures/types/valuser";
import Canvas from "canvas";
import config from "../../../config.json";
import ViewMatchHistory from "../../utils/commands/executors/valorant/viewMatchHistoryExecutor";

const ValorantCommand = createCommand({
    name: "valorant",
    description: "[VALORANT] Commands related to Valorant",
    descriptionLocalizations: {
        "pt-BR": "[VALORANT] Comandos relacionados ao Valorant"
    },
    category: 'util',
    options: [
        {
            name: "verify",
            description: "[VALORANT] Verify your valorant account",
            descriptionLocalizations: {
                "pt-BR": "[VALORANT] Verifique sua conta do valorant"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "authcode",
                nameLocalizations: {
                    "pt-BR": "código_de_autenticação"
                },
                description: "The authentication code",
                descriptionLocalizations: {
                    "pt-BR": "O código de autenticação"
                },
                type: ApplicationCommandOptionTypes.String,
                required: true
            }]
        },
        {
            name: "stats",
            nameLocalizations: {
                "pt-BR": "estatísticas"
            },
            description: "[VALORANT] See VALORANT player stats",
            descriptionLocalizations: {
                "pt-BR": "[VALORANT] Veja as estatísticas de um jogador de VALORANT"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "user",
                nameLocalizations: {
                    "pt-BR": "usuário"
                },
                description: "The user to see the stats",
                descriptionLocalizations: {
                    "pt-BR": "O usuário para ver as estatísticas"
                },
                type: ApplicationCommandOptionTypes.User,
                required: false,
            }]
        },
        {
            name: "matches",
            nameLocalizations: {
                "pt-BR": "partidas"
            },
            description: "[VALORANT] See VALORANT player match history",
            descriptionLocalizations: {
                "pt-BR": "[VALORANT] Veja o histórico de partidas de um jogador de VALORANT"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [{
                name: "user",
                nameLocalizations: {
                    "pt-BR": "usuário"
                },
                description: "The user to see the match history",
                descriptionLocalizations: {
                    "pt-BR": "O usuário para ver o histórico de partidas"
                },
                type: ApplicationCommandOptionTypes.User,
                required: false,
            },
            {
                name: "mode",
                nameLocalizations: {
                    "pt-BR": "modo_de_jogo"
                },
                description: "The match mode",
                descriptionLocalizations: {
                    "pt-BR": "O modo da partida"
                },
                type: ApplicationCommandOptionTypes.String,
                required: false,
                choices: [{
                    name: "Competitive",
                    nameLocalizations: {
                        "pt-BR": "Competitivo"
                    },
                    value: "competitive",
                },
                {
                    name: "Unrated",
                    nameLocalizations: {
                        "pt-BR": "Não ranqueado"
                    },
                    value: "unrated",
                },
                {
                    name: "Spike Rush",
                    nameLocalizations: {
                        "pt-BR": "Spike Rush"
                    },
                    value: "spikerush",
                },
                {
                    name: "Deathmatch",
                    nameLocalizations: {
                        "pt-BR": "Deathmatch"
                    },
                    value: "deathmatch",
                }, {
                    name: "Escalation",
                    nameLocalizations: {
                        "pt-BR": "Escalada"
                    },
                    value: "escalation",
                },
                {
                    name: "Team Deathmatch",
                    nameLocalizations: {
                        "pt-BR": "Team Deathmatch"
                    },
                    value: "teamdeathmatch",
                }]
            },
            {
                name: "map",
                nameLocalizations: {
                    "pt-BR": "mapa"
                },
                description: "The match map",
                descriptionLocalizations: {
                    "pt-BR": "O mapa da partida"
                },
                type: ApplicationCommandOptionTypes.String,
                required: false,
                choices: [{
                    name: "Ascent",
                    value: "ascent",
                },
                {
                    name: "Bind",
                    value: "bind",
                },
                {
                    name: "Breeze",
                    value: "breeze",
                },
                {
                    name: "Fracture",
                    value: "fracture",
                },
                {
                    name: "Haven",
                    value: "haven",
                },
                {
                    name: "Icebox",
                    value: "icebox",
                },
                {
                    name: "Split",
                    value: "split",
                }]
            }]
        },
        {
            name: "link-account",
            nameLocalizations: {
                "pt-BR": "vincular-conta"
            },
            description: "[VALORANT] Link your valorant account to your discord account",
            descriptionLocalizations: {
                "pt-BR": "[VALORANT] Vincule sua conta do valorant a sua conta do Discord"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
        },
        {
            name: "set-visibility",
            nameLocalizations: {
                "pt-BR": "definir-visibilidade"
            },
            description: "[VALORANT] Set your VALORANT account visibility",
            descriptionLocalizations: {
                "pt-BR": "[VALORANT] Defina a visibilidade da sua conta do VALORANT"
            },
            type: ApplicationCommandOptionTypes.SubCommand,

            options: [{
                name: "visibility",
                nameLocalizations: {
                    "pt-BR": "visibilidade"
                },
                description: "Your account visibility",
                descriptionLocalizations: {
                    "pt-BR": "A visibilidade da sua conta"
                },
                type: ApplicationCommandOptionTypes.String,
                required: true,
                choices: [{
                    name: "Private",
                    nameLocalizations: {
                        "pt-BR": "Privado"
                    },
                    value: "true"
                },
                {
                    name: "Public",
                    nameLocalizations: {
                        "pt-BR": "Público"
                    },
                    value: "false"

                }]
            }]
        }],
    commandRelatedExecutions: [ValMatchSelectorExecutor, ViewMatchHistory],
    async execute(context, endCommand, t) {
        const subcommand = context.getSubCommand();
        switch (subcommand) {
            case 'link-account': {
                context.sendReply({
                    embeds: [{
                        color: 0xff4454,
                        title: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.linkAccountTitle')),
                        description: t('commands:valorant.linkAccountDescription')
                    }],
                    components: [createActionRow([createButton({
                        label: t('commands:valorant.linkAccountButton'),
                        style: ButtonStyles.Link,
                        url: `https://auth.riotgames.com/login#client_id=b54a5c51-dd72-400a-8a80-5ad42798cd27&redirect_uri=https://cakey.foxybot.win/rso/auth/callback&response_type=code&scope=openid&state=${context.author.id}`,
                        emoji: {
                            id: bot.emotes.VALORANT_LOGO
                        }
                    })])]
                });
                return endCommand();
            }

            case 'set-visibility': {
                const visibility = context.getOption<string>('visibility', false);
                const valUserInfo = await bot.database.getUser(context.author.id);

                if (valUserInfo.riotAccount.isLinked) {
                    valUserInfo.riotAccount.isPrivate = visibility;
                    await valUserInfo.save();

                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_NICE, t('commands:valorant.visibilityChanged', { visibility: visibility === 'true' ? t('commands:valorant.private') : t('commands:valorant.public') })),
                        flags: MessageFlags.EPHEMERAL
                    });

                    return endCommand();
                }
            }

            case 'matches': {
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
                const matchInfo: any = await bot.foxyRest.getValMatchHistoryByUUID(userData.riotAccount.puuid, context.getOption<string>('mode', false), context.getOption<string>('map', false));
                const valUserInfo = await bot.foxyRest.getValPlayerByUUID(userData.riotAccount.puuid);

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


                            return {
                                name: `${match.meta.map.name} - ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)} - ${match.teams.red ?? 0}/${match.teams.blue ?? 0} - ${result}`,
                                value: `${t('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[match.stats.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \n` +
                                    `K/D/A: ${match.stats.kills}/${match.stats.deaths}/${match.stats.assists} \n` +
                                    `Score: ${match.stats.score} \n` +
                                    `${t('commands:valorant.match.damageMade')}: ${match.stats.damage.made} \n` +
                                    `${t('commands:valorant.match.damageReceived')}: ${match.stats.damage.received} \n`,
                                inline: true
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

            case 'stats': {
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
                const highestRank = getRank(mmrInfo.data.highest_rank.patched_tier);
                const matches = await bot.foxyRest.getAllValMatchHistoryByUUID(await userData.riotAccount.puuid);
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

                const totalMatches = matches.data.length;
                killsPercentage = (totalKills / (totalKills + totalDeaths)) * 100;
                deathsPercentage = (totalDeaths / (totalKills + totalDeaths)) * 100;
                assistsPercentage = (totalAssists / (totalKills + totalDeaths)) * 100;
                headshotsPercentage = (headshots / (headshots + bodyshots + legshots)) * 100;
                bodyshotsPercentage = (bodyshots / (headshots + bodyshots + legshots)) * 100;
                legshotsPercentage = (legshots / (headshots + bodyshots + legshots)) * 100;

                if (userInfo.status === 200) {

                    const canvas = Canvas.createCanvas(1920, 1080);
                    const ctx = canvas.getContext('2d');

                    const background = await Canvas.loadImage(`${config.serverURL}/valorant/background/main.jpg`);

                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                    const darkOverlayOpacity = 0.5;
                    ctx.fillStyle = `rgba(0, 0, 0, ${darkOverlayOpacity})`;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    const characterImage = await Canvas.loadImage(`${config.serverURL}/valorant/agents/${mostPlayedCharacter.toLowerCase()}.png`); // Substitua .png pela extensão real da imagem, se necessário

                    ctx.fillStyle = 'white';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'top';

                    const text = `${userInfo.data.name}#${userInfo.data.tag}`;
                    const x = canvas.width / 2;
                    const y = 35;
                    const highestElo = formattedHighestRank;
                    const xCharacter = 10;
                    const yCharacter = 150;
                    ctx.drawImage(characterImage, xCharacter, yCharacter, 587, 900);

                    ctx.font = '70px Anton';
                    ctx.fillText(text, x, y);
                    ctx.font = '60px Anton';
                    ctx.fillText(highestElo, x, y + 100);

                    const characterText = 'Agente mais jogado';
                    const xCharacterText = xCharacter + characterImage.width / 2;
                    const yCharacterText = yCharacter - 100;
                    ctx.font = '45px Anton';
                    ctx.fillText(characterText, xCharacterText, yCharacterText);
                    
                    ctx.font = '70px Anton';
                    const killsText = 'Kills';
                    ctx.fillStyle = '#0094ff';
                    const xKillsText = canvas.width - 130;
                    const yKillsText = 30;
                    ctx.fillText(killsText, xKillsText, yKillsText);
                    
                    ctx.font = '70px Anton';
                    ctx.fillStyle = 'white';
                    const killsValue = totalKills.toString();
                    const xKillsValue = canvas.width - 130;
                    const yKillsValue = 130;
                    ctx.fillText(killsValue, xKillsValue, yKillsValue);
                    
                    ctx.font = '70px Anton';
                    ctx.fillStyle = '#0094ff';
                    const deathsText = 'Deaths';
                    const xDeathsText = canvas.width - 160;
                    const yDeathsText = 230;
                    ctx.fillText(deathsText, xDeathsText, yDeathsText);
                    
                    ctx.font = '70px Anton';
                    ctx.fillStyle = 'white';
                    const deathsValue = totalDeaths.toString();
                    const xDeathsValue = canvas.width - 130;
                    const yDeathsValue = 330;
                    ctx.fillText(deathsValue, xDeathsValue, yDeathsValue);
                    
                    ctx.font = '70px Anton';
                    const assistsText = 'Assists';
                    ctx.fillStyle = '#0094ff';
                    const xAssistsText = canvas.width - 160;
                    const yAssistsText = 430;
                    ctx.fillText(assistsText, xAssistsText, yAssistsText);
                    
                    ctx.font = '70px Anton';
                    const assistsValue = totalAssists.toString();
                    ctx.fillStyle = 'white';
                    const xAssistsValue = canvas.width - 130;
                    const yAssistsValue = 530;
                    ctx.fillText(assistsValue, xAssistsValue, yAssistsValue);
                    
                    ctx.font = '70px Anton';
                    const matchesText = 'Partidas';
                    ctx.fillStyle = '#0094ff';
                    const xMatchesText = canvas.width - 160;
                    const yMatchesText = 630;
                    ctx.fillText(matchesText, xMatchesText, yMatchesText);
                    
                    ctx.font = '70px Anton';
                    const matchesValue = totalMatches.toString();
                    ctx.fillStyle = 'white';
                    const xMatchesValue = canvas.width - 130;
                    const yMatchesValue = 730;
                    ctx.fillText(matchesValue, xMatchesValue, yMatchesValue);
                    
                    ctx.font = '70px Anton';
                    const currentEloText = t('commands:valorant.player.rank');
                    ctx.fillStyle = '#0094ff';
                    const xCurrentEloText = canvas.width - 230;
                    const yCurrentEloText = 830;
                    ctx.fillText(currentEloText, xCurrentEloText, yCurrentEloText);
                    
                    ctx.font = '70px Anton';
                    ctx.fillStyle = 'white';
                    const currentEloValue = formattedRank;
                    
                    const xText = canvas.width + -50;
                    const yCurrentEloValue = 930;
                    
                    ctx.textAlign = 'end';
                    
                    ctx.fillText(currentEloValue, xText, yCurrentEloValue);
                    
                                        
                    const maxShots = Math.max(headshots, bodyshots, legshots);

                    let headURL = `${config.serverURL}/valorant/body-damage/headshots.png`;
                    let torsoURL = `${config.serverURL}/valorant/body-damage/bodyshots.png`;
                    let legsURL = `${config.serverURL}/valorant/body-damage/legshots.png`;
                    
                    if (maxShots === bodyshots) {
                        torsoURL = `${config.serverURL}/valorant/body-damage/bodyshots2.png`;
                    } else if (maxShots === legshots) {
                        legsURL = `${config.serverURL}/valorant/body-damage/legshots2.png`;
                    } else if (maxShots === headshots) {
                        headURL = `${config.serverURL}/valorant/body-damage/headshots2.png`;
                    }
                    
                    const head = await Canvas.loadImage(headURL);
                    const torso = await Canvas.loadImage(torsoURL);
                    const legs = await Canvas.loadImage(legsURL);
                    
                    const fullBodyCanvas = new Canvas.Canvas(1920, 1080);
                    const fullBodyCtx = fullBodyCanvas.getContext('2d');
                    
                    const originalHeadWidth = head.width;
                    const originalHeadHeight = head.height;
                    const originalTorsoWidth = torso.width;
                    const originalTorsoHeight = torso.height;
                    const originalLegsWidth = legs.width;
                    const originalLegsHeight = legs.height;
                    
                    const proportion = Math.min(
                        fullBodyCanvas.width / originalHeadWidth,
                        fullBodyCanvas.height / originalHeadHeight,
                        fullBodyCanvas.width / originalTorsoWidth,
                        fullBodyCanvas.height / originalTorsoHeight,
                        fullBodyCanvas.width / originalLegsWidth,
                        fullBodyCanvas.height / originalLegsHeight
                    );
                    
                    const scale = 0.7;
                    
                    const adjustedHeadWidth = originalHeadWidth * proportion * scale;
                    const adjustedHeadHeight = originalHeadHeight * proportion * scale;
                    const adjustedTorsoWidth = originalTorsoWidth * proportion * scale;
                    const adjustedTorsoHeight = originalTorsoHeight * proportion * scale;
                    const adjustedLegsWidth = originalLegsWidth * proportion * scale;
                    const adjustedLegsHeight = originalLegsHeight * proportion * scale;
                    
                    fullBodyCtx.drawImage(head, 0, 0, adjustedHeadWidth, adjustedHeadHeight);
                    fullBodyCtx.drawImage(torso, 0, 0, adjustedTorsoWidth, adjustedTorsoHeight);
                    fullBodyCtx.drawImage(legs, 0, 0, adjustedLegsWidth, adjustedLegsHeight);
                    
                    const xFullBody = (canvas.width - adjustedHeadWidth) / 2;
                    const yFullBody = (canvas.height - adjustedHeadHeight) / 2 + 50;
                    
                    const headText = `- ${headshotsPercentage.toFixed(2)}%`;
                    const torsoText = `- ${bodyshotsPercentage.toFixed(2)}%`;
                    const legsText = `- ${legshotsPercentage.toFixed(2)}%`;
                                        
                    fullBodyCtx.fillStyle = 'white';
                    fullBodyCtx.textAlign = 'center';
                    
                    const xHeadText = xFullBody + adjustedHeadWidth / 2 + 250;
                    const yHeadText = yFullBody + 35;
                    
                    const xTorsoText = xFullBody + adjustedTorsoWidth / 2 + 300;
                    const yTorsoText = yFullBody + adjustedHeadHeight - 500;
                    const xLegsText = xFullBody + adjustedLegsWidth / 2 + 250;
                    const yLegsText = yFullBody + adjustedHeadHeight - 270;
                    
                    ctx.drawImage(fullBodyCanvas, xFullBody, yFullBody);
                    
                    ctx.fillStyle = 'white';
                    ctx.textAlign = 'center';
                    
                    ctx.fillText(headText, xHeadText, yHeadText);
                    ctx.fillText(torsoText, xTorsoText, yTorsoText);
                    ctx.fillText(legsText, xLegsText, yLegsText);
                    
                    const blob = new Blob([canvas.toBuffer()], { type: 'image/png' });

                    context.sendReply({
                        file: {
                            blob,
                            name: 'profile.png'
                        },
                        components: [createActionRow([createButton({
                            label: t('commands:valorant.player.viewMatches'),
                            style: 1,
                            customId: createCustomId(1, context.author.id, context.commandId, user.id),
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
            case 'verify': {
                const code = context.getOption<string>('authcode', false);
                const authCode = await bot.database.getCode(code);

                if (!authCode) {
                    return context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:valorant.verify.noAuthCode')),
                    })
                } else {
                    const valUserInfo = await bot.database.getUser(context.author.id);
                    if (valUserInfo.riotAccount.isLinked) {
                        return context.sendReply({
                            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:valorant.verify.alreadyLinked')),
                        })
                    } else {
                        try {
                            const userData = await bot.database.getUser(context.author.id);
                            userData.riotAccount = {
                                isLinked: true,
                                puuid: authCode.puuid,
                                isPrivate: true,
                                region: null,
                            }

                            await userData.save();

                            return context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_NICE, t('commands:valorant.verify.success')),
                            });
                        } catch (err) {
                            console.log(err);
                            return context.sendReply({
                                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:valorant.verify.error')),
                            })
                        }
                    }
                }
            }
        }
    }
});

export default ValorantCommand;