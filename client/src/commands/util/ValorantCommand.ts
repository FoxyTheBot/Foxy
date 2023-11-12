import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { bot } from "../../index";
import { ValUser } from "../../structures/types/valuser";
import { createActionRow, createCustomId, createSelectMenu } from "../../utils/discord/Component";
import ValMatchSelectorExecutor from "../../utils/commands/executors/util/ValMatchSelectorExecutor";

const ValorantCommand = createCommand({
    name: "valorant",
    description: "[VALORANT] Commands related to Valorant",
    descriptionLocalizations: {
        "pt-BR": "[VALORANT] Comandos relacionados ao Valorant"
    },
    category: 'util',
    options: [{
        name: "player",
        description: "[VALORANT] See Valorant player informations",
        descriptionLocalizations: {
            "pt-BR": "[VALORANT] Veja informações de um jogador de Valorant"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "username",
            nameLocalizations: {
                "pt-BR": "nome_de_usuário"
            },
            description: "The player username",
            descriptionLocalizations: {
                "pt-BR": "O nome de usuário do jogador"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }, {
            name: "tag",
            nameLocalizations: {
                "pt-BR": "tag"
            },
            description: "The player tag",
            descriptionLocalizations: {
                "pt-BR": "A tag do jogador"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }]
    },
    {
        name: "matches",
        nameLocalizations: {
            "pt-BR": "partidas"
        },
        description: "[VALORANT] See Valorant player match history",
        descriptionLocalizations: {
            "pt-BR": "[VALORANT] Veja o histórico de partidas de um jogador de Valorant"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: "username",
            nameLocalizations: {
                "pt-BR": "nome_de_usuário"
            },
            description: "The player username",
            descriptionLocalizations: {
                "pt-BR": "O nome de usuário do jogador"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        },
        {
            name: "tag",
            nameLocalizations: {
                "pt-BR": "tag"
            },
            description: "The player tag",
            descriptionLocalizations: {
                "pt-BR": "A tag do jogador"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
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
    }],
    commandRelatedExecutions: [ValMatchSelectorExecutor],
    async execute(context, endCommand, t) {
        const subcommand = context.getSubCommand();

        switch (subcommand) {
            case 'player': {
                context.sendDefer();
                const userInfo: ValUser = await bot.foxyRest.getValPlayer(context.getOption<string>('username', false), context.getOption<string>('tag', false));
                const mmrInfo = await bot.foxyRest.getMMR(userInfo.data.puuid);

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
                            name: "Username",
                            value: userInfo.data.name,
                            inline: true
                        },
                        {
                            name: t('commands:valorant.player.tag'),
                            value: userInfo.data.tag,
                            inline: true

                        },
                        {
                            name: t('commands:valorant.player.level'),
                            value: userInfo.data.account_level.toString(),
                            inline: true
                        },
                        {
                            name: t('commands:valorant.player.rank'),
                            value: formattedRank,
                        }]
                    })

                    context.sendReply({
                        embeds: [embed],
                    });
                    return endCommand();
                } else {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:valorant.player.notFound'))
                    });
                    return endCommand();
                }
            }

            case 'matches': {
                context.sendDefer();
                const matchInfo: any = await bot.foxyRest.getValMatchHistory(context.getOption<string>('username', false), context.getOption<string>('tag', false), context.getOption<string>('mode', false), context.getOption<string>('map', false));
                const userInfo = await bot.foxyRest.getValPlayer(context.getOption<string>('username', false), context.getOption<string>('tag', false));

                try {
                    const embed = createEmbed({
                        color: 0xf84354,
                        thumbnail: {
                            url: userInfo.data.card.small
                        },
                        title: context.getEmojiById(bot.emotes.VALORANT_LOGO) + " " + t('commands:valorant.match.title', { username: userInfo.data.name, tag: userInfo.data.tag }),
                        fields: matchInfo.data.map(match => {
                            return {
                                name: `${match.meta.map.name} - ${match.meta.mode}`,
                                value: `${t('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[match.stats.character.name.toUpperCase() ?? bot.emotes.FOXY_SHRUG])} \nKDA: ${match.stats.kills}/${match.stats.deaths}/${match.stats.assists} \n${t('commands:valorant.match.result')}: ${match.teams.red && match.teams.blue ? `Red: ${match.teams.red} / Blue: ${match.teams.blue}` : t('commands:valorant.noResult')}\n`,
                                inline: true
                            }
                        }),
                        footer: {
                            text: t("commands:valorant.match.footer")
                        }
                    });

                    const row = createActionRow([createSelectMenu({
                        customId: createCustomId(0, context.author.id, context.commandId),
                        placeholder: t('commands:valorant.match.placeholder'),
                        options: matchInfo.data.map(match => {
                            return {
                                label: `${match.meta.map.name} - ${match.meta.mode}`,
                                value: match.meta.id,
                                description: `${match.stats.character.name} | KDA: ${match.stats.kills}/${match.stats.deaths}/${match.stats.assists}`,
                            }
                        })
                    })])
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
        }
    }
});

export default ValorantCommand;