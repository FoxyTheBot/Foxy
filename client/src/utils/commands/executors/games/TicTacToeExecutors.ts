import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../..";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";
import { createEmbed } from "../../../discord/Embed";

var tttGame = [
    ['‎', '‎', '‎'],
    ['‎', '‎', '‎'],
    ['‎', '‎', '‎'],
];


const TicTacToeFirstExecutor = async (context: ComponentInteractionContext) => {
    const [targetUsername, targetUserId] = context.sentData;

    const checkAuthor = await bot.database.verifyUser(context.author.id);
    const checkUser = await bot.database.verifyUser(targetUserId);
    if (checkAuthor) {
        context.sendReply({
            content: bot.locale('commands:tictactoe.alreadyPlaying', { user: `<@!${targetUserId}>` }),
            components: [createActionRow([createButton({
                customId: createCustomId(0, targetUserId, context.commandId, targetUsername, targetUserId),
                label: bot.locale('commands:tictactoe.accept'),
                style: ButtonStyles.Success,
                disabled: true
            }), createButton({
                customId: createCustomId(1, targetUserId, context.commandId, targetUsername,targetUserId),
                label: bot.locale('commands:tictactoe.decline'),
                style: ButtonStyles.Danger,
                disabled: true
            })])]
        })
        return;
    } else if (checkUser) {
        context.sendReply({
            content: bot.locale('commands:tictactoe.alreadyPlaying', { user: `<@!${context.author.id}>` }),
            components: [createActionRow([createButton({
                customId: createCustomId(0, targetUserId, context.commandId, targetUsername, targetUserId),
                label: bot.locale('commands:tictactoe.accept'),
                style: ButtonStyles.Success,
                disabled: true
            }), createButton({
                customId: createCustomId(1, targetUserId, context.commandId, targetUsername, targetUserId),
                label: bot.locale('commands:tictactoe.decline'),
                style: ButtonStyles.Danger,
                disabled: true
            })])]
        })
        return;
    } else {
        bot.database.createSession(context.commandId, context.author.id, targetUserId);
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

    const currentUser = await bot.helpers.getUser(context.author.id);
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
    var currentTurn;
    const sessionInfo = await bot.database.getSessionInfo(context.commandId);
    if (sessionInfo.commandAuthor.isYourTurn) {
        let splitId = choice.split(",");
        if (tttGame[splitId[0]][splitId[1]] === "‎") {
            tttGame[splitId[0]][splitId[1]] = "❌";
            sessionInfo.user.isYourTurn = true;
            sessionInfo.commandAuthor.isYourTurn = false;
            await sessionInfo.save();
            currentTurn = sessionInfo.user.id;
        }
    } else if (sessionInfo.user.isYourTurn) {
        let splitId = choice.split(",");
        if (tttGame[splitId[0]][splitId[1]] === "‎") {
            tttGame[splitId[0]][splitId[1]] = "⭕";
            sessionInfo.user.isYourTurn = false;
            sessionInfo.commandAuthor.isYourTurn = true;
            await sessionInfo.save();
            currentTurn = sessionInfo.commandAuthor.id;
        }
    }
    const currentUser = await bot.helpers.getUser(BigInt(currentTurn));
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
        bot.database.finishSession(context.commandId);
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
        bot.database.finishSession(context.commandId);
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

    if (tttGame[0][0] !== '‎' && tttGame[0][1] !== '‎' && tttGame[0][2] !== '‎' && tttGame[1][0] !== '‎' && tttGame[1][1] !== '‎' && tttGame[1][2] !== '‎' && tttGame[2][0] !== '‎' && tttGame[2][1] !== '‎' && tttGame[2][2] !== '‎') {
        bot.database.finishSession(context.commandId);
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
                description: bot.locale('commands:tictactoe.draw'),
            })],
            components: [row, row2, row3]
        })
    }
}
export { TicTacToeFirstExecutor, TicTacToeExecutor }