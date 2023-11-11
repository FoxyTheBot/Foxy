import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { bot } from "../../index";
import { ValUser } from "../../structures/types/valuser";

const ValorantCommand = createCommand({
    name: "valorant",
    description: "[Utils] Commands related to Valorant",
    descriptionLocalizations: {
        "pt-BR": "[Utilitários] Comandos relacionados ao Valorant"
    },
    category: 'util',
    options: [{
        name: "player",
        description: "[Utils] See Valorant player informations",
        descriptionLocalizations: {
            "pt-BR": "[Utilitários] Veja informações de um jogador de Valorant"
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
        name: "match-history",
        description: "[Utils] See Valorant player match history",
        descriptionLocalizations: {
            "pt-BR": "[Utilitários] Veja o histórico de partidas de um jogador de Valorant"
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
                "pt-BR": "modo"
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
    async execute(context, endCommand, t) {
        const subcommand = context.getSubCommand();

        switch (subcommand) {
            case 'player': {
                const userInfo: ValUser = await bot.foxyRest.getValPlayer(context.getOption<string>('username', false), context.getOption<string>('tag', false));
                context.sendDefer();

                if (userInfo.status === 200) {
                    const embed = createEmbed({
                        color: 0xf84355,
                        title: t('commands:valorant.player.title', { username: userInfo.data.name, tag: userInfo.data.tag }),
                        image: {
                            url: userInfo.data.card.wide
                        },
                        thumbnail: {
                            url: userInfo.data.card.small
                        },
                        fields: [{
                            name: "UUID",
                            value: `\`${userInfo.data.puuid}\``,
                            inline: true
                        },
                        {
                            name: t('commands:valorant.player.level'),
                            value: userInfo.data.account_level.toString(),
                            inline: true
                        },
                        {
                            name: t('commands:valorant.player.tag'),
                            value: userInfo.data.tag,
                            inline: true

                        },
                        {
                            name: "Username",
                            value: userInfo.data.name,
                            inline: true
                        }]
                    })

                    context.sendReply({
                        embeds: [embed],
                    });
                    return endCommand();
                } else {
                    context.sendReply({
                        content: t('commands:valorant.player.notFound')
                    });
                    return endCommand();
                }
            }

            case 'match-history': {
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
                                value: `${t('commands:valorant.match.character')}: ${context.getEmojiById(bot.emotes[match.stats.character.name.toUpperCase()])} \nK: ${match.stats.kills} / D: ${match.stats.deaths} / A: ${match.stats.assists} \n${t('commands:valorant.match.result')}: ${match.teams.red && match.teams.blue ? `Red: ${match.teams.red} / Blue: ${match.teams.blue}` : t('commands:valorant.noResult')}\n`,
                                inline: true
                            }
                        }),
                        footer: {
                            text: t("commands:valorant.match.footer")
                        }
                    });

                    context.sendReply({
                        embeds: [embed]
                    });
                    return endCommand();
                } catch (err) {
                    context.sendReply({
                        content: t('commands:valorant.match.notFound')
                    });
                    return endCommand();
                }
            }
        }
    }
});

export default ValorantCommand;