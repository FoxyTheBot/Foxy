import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createEmbed } from "../../../discord/Embed";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";

var userTurn;
var authorTurn;
var currentTurn;
var isUserAlreadyPlaying;
var isAuthorAlreadyPlaying;
var tttGame = [
    ['‎', '‎', '‎'],
    ['‎', '‎', '‎'],
    ['‎', '‎', '‎'],
];

const TicTacToeFirstExecutor = async (context: ComponentInteractionContext) => {
    const [targetUsername, targetUserId] = context.sentData;

    if (isUserAlreadyPlaying) {
        return context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_THINK, bot.locale('commands:tictactoe.alreadyPlaying', {
                user: targetUsername,
            })),
        });
    } else if (isAuthorAlreadyPlaying) {
        return context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_THINK, bot.locale('commands:tictactoe.alreadyPlaying', {
                user: context.author.username,
            }))
        })
    } else {
        isUserAlreadyPlaying = true;
        isAuthorAlreadyPlaying = true;
    }

    const row = createActionRow([
        createButton({
            customId: createCustomId(2, context.author.id, context.commandId, targetUsername, targetUserId, "0,0"),
            label: tttGame[0][0],
            style: ButtonStyles.Primary,
        }),
        createButton({
            customId: createCustomId(2, context.author.id, context.commandId, targetUsername, targetUserId, "0,1"),
            label: tttGame[0][1],
            style: ButtonStyles.Primary,
        }),
        createButton({
            customId: createCustomId(2, context.author.id, context.commandId, targetUsername, targetUserId, "0,2"),
            label: tttGame[0][2],
            style: ButtonStyles.Primary,
        })
    ]);

    const row2 = createActionRow([createButton({
        customId: createCustomId(2, context.author.id, context.commandId, targetUsername, targetUserId, "1,0"),
        label: tttGame[1][0],
        style: ButtonStyles.Primary,
    }),
    createButton({
        customId: createCustomId(2, context.author.id, context.commandId, targetUsername, targetUserId, "1,1"),
        label: tttGame[1][1],
        style: ButtonStyles.Primary,
    }),
    createButton({
        customId: createCustomId(2, context.author.id, context.commandId, targetUsername, targetUserId, "1,2"),
        label: tttGame[1][2],
        style: ButtonStyles.Primary,
    })
    ]);

    const row3 = createActionRow([createButton({
        customId: createCustomId(2, context.author.id, context.commandId, targetUsername, targetUserId, "2,0"),
        label: tttGame[2][0],
        style: ButtonStyles.Primary,
    }),
    createButton({
        customId: createCustomId(2, context.author.id, context.commandId, targetUsername, targetUserId, "2,1"),
        label: tttGame[2][1],
        style: ButtonStyles.Primary,
    }),
    createButton({
        customId: createCustomId(2, context.author.id, context.commandId, targetUsername, targetUserId, "2,2"),
        label: tttGame[2][2],
        style: ButtonStyles.Primary,
    })
    ])

    currentTurn = context.author.id;
    authorTurn = true;
    userTurn = false;
    const currentUser = await bot.helpers.getUser(currentTurn);
    context.sendReply({
        content: bot.locale('commands:tictactoe.content', {
            user: `<@!${targetUserId}>`,
            author: `<@!${context.author.id}>`
        }),
        embeds: [createEmbed({
            title: bot.locale('commands:tictactoe.title'),
            description: bot.locale('commands:tictactoe.yourTurn', { user: currentUser.username }),
        })],
        components: [row, row2, row3]
    })

}

const TicTacToeExecutor = async (context: ComponentInteractionContext) => {
    const [targetUsername, targetUserId, choice] = context.sentData;

    if (authorTurn) {
        let splitId = choice.split(",");
        if (tttGame[splitId[0]][splitId[1]] === "‎") {
            tttGame[splitId[0]][splitId[1]] = "❌";
            authorTurn = false;
            userTurn = true;
            currentTurn = targetUserId;
        }
    } else if (userTurn) {
        let splitId = choice.split(",");
        if (tttGame[splitId[0]][splitId[1]] === "‎") {
            tttGame[splitId[0]][splitId[1]] = "⭕";
            authorTurn = true;
            userTurn = false;
            currentTurn = context.author.id;
        }
    }
    const currentUser = await bot.helpers.getUser(currentTurn);
    const row = createActionRow([
        createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "0,0"),
            label: tttGame[0][0],
            style: ButtonStyles.Primary,
        }),
        createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "0,1"),
            label: tttGame[0][1],
            style: ButtonStyles.Primary,
        }),
        createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "0,2"),
            label: tttGame[0][2],
            style: ButtonStyles.Primary,
        })
    ]);

    const row2 = createActionRow([createButton({
        customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "1,0"),
        label: tttGame[1][0],
        style: ButtonStyles.Primary,
    }),
    createButton({
        customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "1,1"),
        label: tttGame[1][1],
        style: ButtonStyles.Primary,
    }),
    createButton({
        customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "1,2"),
        label: tttGame[1][2],
        style: ButtonStyles.Primary,
    })
    ]);

    const row3 = createActionRow([createButton({
        customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "2,0"),
        label: tttGame[2][0],
        style: ButtonStyles.Primary,
    }),
    createButton({
        customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "2,1"),
        label: tttGame[2][1],
        style: ButtonStyles.Primary,
    }),
    createButton({
        customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "2,2"),
        label: tttGame[2][2],
        style: ButtonStyles.Primary,
    })
    ])

    context.sendReply({
        embeds: [createEmbed({
            title: bot.locale('commands:tictactoe.title'),
            description: bot.locale('commands:tictactoe.yourTurn', { user: currentUser.username }),
        })],
        components: [row, row2, row3]
    })

    if (tttGame[0][0] === "❌" && tttGame[0][1] === "❌" && tttGame[0][2] === "❌" || tttGame[1][0] === '❌' && tttGame[1][1] === '❌' && tttGame[1][2] === '❌'
        || tttGame[2][0] === '❌' && tttGame[2][1] === '❌' && tttGame[2][2] === '❌' || tttGame[0][0] === '❌' && tttGame[1][0] === '❌' && tttGame[2][0] === '❌'
        || tttGame[0][0] === '❌' && tttGame[1][0] === '❌' && tttGame[2][0] === '❌' || tttGame[0][1] === '❌' && tttGame[1][1] === '❌' && tttGame[2][1] === '❌'
        || tttGame[0][2] === '❌' && tttGame[1][2] === '❌' && tttGame[2][2] === '❌' || tttGame[2][0] === '❌' && tttGame[1][1] === '❌' && tttGame[0][2] === '❌'
        || tttGame[0][0] === '❌' && tttGame[1][1] === '❌' && tttGame[2][2] === '❌') {
        isAuthorAlreadyPlaying = false;
        isUserAlreadyPlaying = false;
        const row = createActionRow([
            createButton({
                customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "0,0"),
                label: tttGame[0][0],
                style: ButtonStyles.Primary,
                disabled: true
            }),
            createButton({
                customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "0,1"),
                label: tttGame[0][1],
                style: ButtonStyles.Primary,
                disabled: true
            }),
            createButton({
                customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "0,2"),
                label: tttGame[0][2],
                style: ButtonStyles.Primary,
                disabled: true
            })
        ]);

        const row2 = createActionRow([createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "1,0"),
            label: tttGame[1][0],
            style: ButtonStyles.Primary,
            disabled: true
        }),
        createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "1,1"),
            label: tttGame[1][1],
            style: ButtonStyles.Primary,
            disabled: true
        }),
        createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "1,2"),
            label: tttGame[1][2],
            style: ButtonStyles.Primary,
            disabled: true
        })
        ]);

        const row3 = createActionRow([createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "2,0"),
            label: tttGame[2][0],
            style: ButtonStyles.Primary,
            disabled: true
        }),
        createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "2,1"),
            label: tttGame[2][1],
            style: ButtonStyles.Primary,
            disabled: true
        }),
        createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "2,2"),
            label: tttGame[2][2],
            style: ButtonStyles.Primary,
            disabled: true
        })
        ])
        tttGame = [
            ['‎', '‎', '‎'],
            ['‎', '‎', '‎'],
            ['‎', '‎', '‎'],
        ]
        return context.respondInteraction({
            embeds: [createEmbed({
                title: bot.locale('commands:tictactoe.title'),
                description: bot.locale('commands:tictactoe.winner', { user: context.author.username }),
            })],
            components: [row, row2, row3]
        })
    }
    if (tttGame[0][0] === "⭕" && tttGame[0][1] === "⭕" && tttGame[0][2] === "⭕" || tttGame[1][0] === '⭕' && tttGame[1][1] === '⭕' && tttGame[1][2] === '⭕'
        || tttGame[2][0] === '⭕' && tttGame[2][1] === '⭕' && tttGame[2][2] === '⭕' || tttGame[0][0] === '⭕' && tttGame[1][0] === '⭕' && tttGame[2][0] === '⭕'
        || tttGame[0][1] === '⭕' && tttGame[1][1] === '⭕' && tttGame[2][1] === '⭕' || tttGame[0][2] === '⭕' && tttGame[1][2] === '⭕' && tttGame[2][2] === '⭕'
        || tttGame[2][0] === '⭕' && tttGame[1][1] === '⭕' && tttGame[0][2] === '⭕' || tttGame[0][0] === '⭕' && tttGame[1][1] === '⭕' && tttGame[2][2] === '⭕') {
        isAuthorAlreadyPlaying = false;
        isUserAlreadyPlaying = false;
        const row = createActionRow([
            createButton({
                customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "0,0"),
                label: tttGame[0][0],
                style: ButtonStyles.Primary,
                disabled: true
            }),
            createButton({
                customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "0,1"),
                label: tttGame[0][1],
                style: ButtonStyles.Primary,
                disabled: true
            }),
            createButton({
                customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "0,2"),
                label: tttGame[0][2],
                style: ButtonStyles.Primary,
                disabled: true
            })
        ]);

        const row2 = createActionRow([createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "1,0"),
            label: tttGame[1][0],
            style: ButtonStyles.Primary,
            disabled: true
        }),
        createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "1,1"),
            label: tttGame[1][1],
            style: ButtonStyles.Primary,
            disabled: true
        }),
        createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "1,2"),
            label: tttGame[1][2],
            style: ButtonStyles.Primary,
            disabled: true
        })
        ]);

        const row3 = createActionRow([createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "2,0"),
            label: tttGame[2][0],
            style: ButtonStyles.Primary,
            disabled: true
        }),
        createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "2,1"),
            label: tttGame[2][1],
            style: ButtonStyles.Primary,
            disabled: true
        }),
        createButton({
            customId: createCustomId(2, currentTurn, context.commandId, targetUsername, targetUserId, "2,2"),
            label: tttGame[2][2],
            style: ButtonStyles.Primary,
            disabled: true
        })
        ])
        tttGame = [
            ['‎', '‎', '‎'],
            ['‎', '‎', '‎'],
            ['‎', '‎', '‎'],
        ]
        return context.respondInteraction({
            embeds: [createEmbed({
                title: bot.locale('commands:tictactoe.title'),
                description: bot.locale('commands:tictactoe.winner', { user: targetUsername }),
            })],
            components: [row, row2, row3]
        })
    }
}
export { TicTacToeFirstExecutor, TicTacToeExecutor }