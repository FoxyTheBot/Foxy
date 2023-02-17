import { createCommand } from "../../structures/commands/createCommand";
import { createEmbed } from "../../utils/discord/Embed";
import { createCustomId, createActionRow, createButton } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { startRpsGame } from "../../structures/commands/modules/startRpsGame";
import { MessageFlags } from "../../utils/discord/Message";

const RpsCommand = createCommand({
    name: 'rps',
    description: "[📺] Jogue pedra, papel ou tesoura com a Foxy",
    descriptionLocalizations: {
        "en-US": "[📺] Play rock, paper or scissors with Foxy"
    },

    options: [
        {
            name: "singleplayer",
            description: "[📺] Play rock, paper or scissors with Foxy",
            descriptionLocalizations: {
                "pt-BR": "[📺] Jogue pedra, papel ou tesoura com a Foxy"
            },
            type: ApplicationCommandOptionTypes.SubCommand
        },
        {
            name: "multiplayer",
            description: "[📺] Play rock, paper or scissors with someone",
            descriptionLocalizations: {
                "pt-BR": "[📺] Jogue pedra papel ou tesoura com alguém"
            },
            type: ApplicationCommandOptionTypes.SubCommand,
            options: [
                {
                    name: "user",
                    nameLocalizations: {
                        "pt-BR": "usuario"
                    },
                    description: "The user you want to play",
                    descriptionLocalizations: {
                        "pt-BR": "O usuário que você quer jogar"
                    },
                    required: true,
                    type: ApplicationCommandOptionTypes.User
                }
            ]
        }
    ],
    category: 'fun',
    commandRelatedExecutions: [startRpsGame],
    execute: async (ctx, endCommand, t) => {
        const subcommand = ctx.getSubCommand();

        switch (subcommand) {
            case "singleplayer": {
                ctx.foxyReply({
                    components: [createActionRow([createButton({
                        label: " ",
                        customId: createCustomId(0, ctx.author.id, ctx.commandId, "rock", false),
                        style: ButtonStyles.Primary,
                        emoji: {
                            name: "✊"
                        }
                    }), createButton({
                        label: " ",
                        customId: createCustomId(0, ctx.author.id, ctx.commandId, "paper", false),
                        style: ButtonStyles.Primary,
                        emoji: {
                            name: "🤚"
                        }
                    }), createButton({
                        label: " ",
                        customId: createCustomId(0, ctx.author.id, ctx.commandId, "scissor", false),
                        style: ButtonStyles.Primary,
                        emoji: {
                            name: "✌"
                        }
                    })])],
                    flags: MessageFlags.Ephemeral
                });

                endCommand;
                break;
            }

            case "multiplayer": {
                ctx.foxyReply({
                    components: [createActionRow([createButton({
                        label: " ",
                        customId: createCustomId(0, ctx.author.id, ctx.commandId, "rock", true),
                        style: ButtonStyles.Primary,
                        emoji: {
                            name: "✊"
                        }
                    }), createButton({
                        label: " ",
                        customId: createCustomId(0, ctx.author.id, ctx.commandId, "paper", true),
                        style: ButtonStyles.Primary,
                        emoji: {
                            name: "🤚"
                        }
                    }), createButton({
                        label: " ",
                        customId: createCustomId(0, ctx.author.id, ctx.commandId, "scissor", true),
                        style: ButtonStyles.Primary,
                        emoji: {
                            name: "✌"
                        }
                    })])]
                });

                endCommand;
                break;
            }
        }
    }
});

export default RpsCommand;