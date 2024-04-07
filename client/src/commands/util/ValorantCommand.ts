import { createCommand } from "../../structures/commands/createCommand";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from "../../index";

/* Command executors */

import ValMatchSelectorExecutor from "../../utils/commands/executors/valorant/ValMatchSelectorExecutor";
import ViewMatchHistory from "../../utils/commands/executors/valorant/viewMatchHistoryExecutor";
import RankSelectorExecutor from "../../utils/commands/executors/valorant/RankSelectorExecutor";
import RankSelectedExecutor from "../../utils/commands/executors/valorant/RankSelectedExecutor";
import ConfirmDeletionExecutor from "../../utils/commands/executors/valorant/ConfirmDeletionExecutor";

/* Subcommand functions */

import { executeValorantAutoroleCommand, executeValorantUpdateAutoroleCommand } from "../../structures/commands/ValorantCommand/ValorantAutorole";
import executeValorantStatsCommand from "../../structures/commands/ValorantCommand/ValorantStats";
import executeValorantMatchesCommand from "../../structures/commands/ValorantCommand/ValorantMatches";
import executeValorantLinkCommand from "../../structures/commands/ValorantCommand/ValorantLink";
import executeValorantSetVisibilityCommand from "../../structures/commands/ValorantCommand/ValorantSetVisibility";
import executeValorantUnlinkCommand from "../../structures/commands/ValorantCommand/ValorantUnlink";
import executeValorantHelpCommand from "../../structures/commands/ValorantCommand/ValorantHelp";
import executeValorantVerifyCommand from "../../structures/commands/ValorantCommand/ValorantVerify";

const ValorantCommand = createCommand({
    name: "valorant",
    description: "[VALORANT] Get VALORANT player stats and match history and more",
    descriptionLocalizations: {
        "pt-BR": "[VALORANT] Veja as estatísticas, informações de partidas de um jogador de VALORANT e mais"
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
            name: "help",
            nameLocalizations: {
                "pt-BR": "ajuda"
            },
            description: "[VALORANT] Get help with the valorant commands",
            descriptionLocalizations: {
                "pt-BR": "[VALORANT] Obtenha ajuda com os comandos do valorant"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        },
        {
            name: "unlink",
            description: "[VALORANT] Unlink your VALORANT account",
            descriptionLocalizations: {
                "pt-BR": "[VALORANT] Desvincule a sua conta do VALORANT"
            },
            type: ApplicationCommandOptionTypes.SubCommand
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
                        "pt-BR": "Sem Classificação"
                    },
                    value: "unrated",
                },
                {
                    name: "Spike Rush",
                    nameLocalizations: {
                        "pt-BR": "Disputa da Spike"
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
                },
                {
                    name: "Premier",
                    nameLocalizations: {
                        "pt-BR": "Premier"
                    },
                    value: "premier",
                }]
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
                        "pt-BR": "Sem Classificação"
                    },
                    value: "unrated",
                },
                {
                    name: "Spike Rush",
                    nameLocalizations: {
                        "pt-BR": "Disputa da Spike"
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
                    value: "team deathmatch",
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
            name: 'update-role',
            nameLocalizations: {
                "pt-BR": "atualizar-cargo"
            },
            description: "[VALORANT] Update your role according with your rank",
            descriptionLocalizations: {
                "pt-BR": "[VALORANT] Atualize o cargo do seu ranque em servidores que utilizam essa funcionalidade!"
            },
            type: ApplicationCommandOptionTypes.SubCommand
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
        },
        {
            name: "autorole",
            description: "[VALORANT] Give a role to a VALORANT player based on their rank",
            descriptionLocalizations: {
                "pt-BR": "[VALORANT] Dê um cargo a um jogador de VALORANT baseado no rank dele"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        }],
    commandRelatedExecutions: [
        ValMatchSelectorExecutor, // 0 
        ViewMatchHistory, // 1
        RankSelectorExecutor, // 2
        RankSelectedExecutor, // 3
        ConfirmDeletionExecutor // 4
    ],
    async execute(context, endCommand, t) {
        const subcommand = context.getSubCommand();
        switch (subcommand) {
            case 'link-account': {
                executeValorantLinkCommand(bot, context, endCommand, t);
                break;
            }

            case 'set-visibility': {
                executeValorantSetVisibilityCommand(bot, context, endCommand, t);
                break;
            }

            case 'unlink': {
                executeValorantUnlinkCommand(bot, context, endCommand, t);
                break;
            }

            case 'help': {
                executeValorantHelpCommand(bot, context, endCommand, t);
                break;
            }

            case 'matches': {
                executeValorantMatchesCommand(bot, context, endCommand, t);
                break;
            }

            case 'autorole': {
                executeValorantAutoroleCommand(bot, context, endCommand, t);
                break;
            }

            case 'update-role': {
                executeValorantUpdateAutoroleCommand(bot, context, endCommand, t);
                break;
            }

            case 'stats': {
                executeValorantStatsCommand(bot, context, endCommand, t);
                break;
            }
            case 'verify': {
                executeValorantVerifyCommand(bot, context, endCommand, t);
                break;
            }
        }
    }
});

export default ValorantCommand;