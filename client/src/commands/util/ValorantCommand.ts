import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { bot } from "../../index";
import { createActionRow, createCustomId, createSelectMenu } from "../../utils/discord/Component";
import ValMatchSelectorExecutor from "../../utils/commands/executors/util/ValMatchSelectorExecutor";
import { MessageFlags } from "../../utils/discord/Message";
import { User } from "discordeno/transformers";

const ValorantCommand = createCommand({
    name: "valorant",
    description: "[VALORANT] Commands related to Valorant",
    descriptionLocalizations: {
        "pt-BR": "[VALORANT] Comandos relacionados ao Valorant"
    },
    category: 'util',
    options: [
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
                type: ApplicationCommandOptionTypes.Boolean,
                required: true,
            }]
        }],
    commandRelatedExecutions: [ValMatchSelectorExecutor],
    async execute(context, endCommand, t) {
        const subcommand = context.getSubCommand();

        switch (subcommand) {
            case 'link-account': {
                context.sendReply({
                    content: context.makeReply(bot.emotes.VALORANT_LOGO, t('commands:valorant.linkAccount', { url: `https://auth.riotgames.com/login#client_id=b54a5c51-dd72-400a-8a80-5ad42798cd27&redirect_uri=https://cakey.foxybot.win/rso/auth/callback&response_type=code&scope=openid&state=${context.author.id}` })),
                    flags: MessageFlags.EPHEMERAL
                });
                return endCommand();
            }

            case 'set-visibility': {
                const visibility = context.getOption<boolean>('visibility', false);
                const valUserInfo = await bot.database.getUser(context.author.id);

                if (valUserInfo.riotAccount.isLinked) {
                    valUserInfo.riotAccount.isPrivate = visibility;
                    await valUserInfo.save();

                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_NICE, t('commands:valorant.visibilityChanged', { visibility: visibility ? t('commands:valorant.private') : t('commands:valorant.public') })),
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

                try {
                    const embed = createEmbed({
                        color: 0xf84354,
                        thumbnail: {
                            url: valUserInfo.data.card.small
                        },
                        title: context.getEmojiById(bot.emotes.VALORANT_LOGO) + " " + t('commands:valorant.match.title', { username: valUserInfo.data.name, tag: valUserInfo.data.tag }),
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