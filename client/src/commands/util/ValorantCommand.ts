import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { bot } from "../../index";
import { createActionRow, createButton, createCustomId, createSelectMenu } from "../../utils/discord/Component";
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
    commandRelatedExecutions: [ValMatchSelectorExecutor],
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

                try {
                    const embed = createEmbed({
                        color: 0xf84354,
                        thumbnail: {
                            url: valUserInfo.data.card.small
                        },
                        title: context.getEmojiById(bot.emotes.VALORANT_LOGO) + " " + t('commands:valorant.match.title', { username: valUserInfo.data.name, tag: valUserInfo.data.tag }),
                        fields: matchInfo.data.map(match => {
                            let teamHasWon;
                            if (match.teams.red > match.teams.blue) teamHasWon = "Red"
                            else if (match.teams.red < match.teams.blue) teamHasWon = "Blue"
                            else teamHasWon = "Draw";
                            return {
                                name: `${match.meta.map.name} - ${bot.locale(`commands:valorant.match.modes.${match.meta.mode.toLowerCase()}`)} - ${match.teams.red ?? 0}/${match.teams.blue ?? 0} - ${match.stats.team === teamHasWon ?
                                    context.getEmojiById(bot.emotes.FOXY_YAY) + " " + t('commands:valorant.match.win') : context.getEmojiById(bot.emotes.FOXY_CRY) + " " + t('commands:valorant.match.loss') ?? context.getEmojiById(bot.emotes.FOXY_SHRUG)}`,
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
                            customId: createCustomId(0, context.author.id, context.commandId),
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
                            customId: createCustomId(0, context.author.id, context.commandId),
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