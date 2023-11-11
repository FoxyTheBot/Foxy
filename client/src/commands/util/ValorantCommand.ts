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
                try {
                    const embed = createEmbed({
                        color: 0x7289DA,
                        title: t('commands:valorant.player.title', { username: context.getOption<string>('username', false), tag: context.getOption<string>('tag', false) }),
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
                } catch (err) {
                    context.sendReply({
                        content: t('commands:valorant.player.notFound')
                    });
                    endCommand();
                }
                break;
            }

            case 'match-history': {
                const matchInfo: any = await bot.foxyRest.getValMatchHistory(context.getOption<string>('username', false), context.getOption<string>('tag', false), context.getOption<string>('mode', false), context.getOption<string>('map', false));
                context.sendDefer();
                try {
                    console.log(matchInfo.data[0].meta);
                    const embed = createEmbed({
                        color: 0x7289DA,
                        title: t('commands:valorant.match.title', { username: context.getOption<string>('username', false), tag: context.getOption<string>('tag', false) }),
                        description: matchInfo.data.map(match => {
                            return `**${t('commands:valorant.match.map')}:** ${match.meta.map.name} - **${t('commands:valorant.match.mode')}:** ${match.meta.mode} - **${t('commands:valorant.match.character')}:** ${context.getEmojiById(bot.emotes[match.stats.character.name.toUpperCase()])} ${match.stats.character.name} - K: ${match.stats.kills} / D: ${match.stats.deaths} / A: ${match.stats.assists} - **${t('commands:valorant.match.result')}:** Red: ${match.teams.red ?? t('commands:valorant.noResult')} / Blue: ${match.teams.blue ?? t('commands:valorant.noResult')}\n`
                        }).join('\n'),
                    });

                    context.sendReply({
                        embeds: [embed]
                    });
                    endCommand();
                } catch (err) {
                    context.sendReply({
                        content: t('commands:valorant.match.notFound')
                    });
                    endCommand();
                }
            }
        }
    }
});

export default ValorantCommand;