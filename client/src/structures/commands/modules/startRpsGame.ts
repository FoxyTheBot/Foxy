import ComponentInteractionContext from "../ComponentInteractionContext";
import { bot } from "../../../index";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

const startRpsGame = async (ctx: ComponentInteractionContext) => {
    const [choice, isMultiplayer] = ctx.sentData;
    const acceptedReplies = ["rock", "paper", "scissors"];

    if (isMultiplayer) {
        switch (choice) {
            case "rock": {
    
                break;
            }
    
            case "paper": {
    
                break;
            }
    
            case "scissor": {
    
                break;
            }
        }
    } else {
        const random = Math.floor((Math.random() * acceptedReplies.length));
        const result = acceptedReplies[random];
        ctx.foxyReply({
            components: [createActionRow([createButton({
                label: " ",
                customId: createCustomId(0, ctx.author.id, ctx.commandId, "rock", false),
                style: ButtonStyles.Secondary,
                emoji: {
                    name: "✊"
                },
                disabled: true
            }), createButton({
                label: " ",
                customId: createCustomId(0, ctx.author.id, ctx.commandId, "paper", false),
                style: ButtonStyles.Secondary,
                emoji: {
                    name: "🤚"
                },
                disabled: true
            }), createButton({
                label: " ",
                customId: createCustomId(0, ctx.author.id, ctx.commandId, "scissor", false),
                style: ButtonStyles.Secondary,
                emoji: {
                    name: "✌"
                },
                disabled: true
            })])],
            flags: 64
        });

        switch (choice) {
            case bot.locale('commands:rps.replies.rock'): {
                if (result === bot.locale('commands:rps.replies.paper')) {
                    ctx.followUp({
                        content: bot.locale('commands:rps.clientWon', { result: result }),
                        flags: 64
                    })
    
                }
                ctx.followUp({
                    content: bot.locale('commands:rps.won3'),
                    flags: 64
                })

                break;
            }
            case bot.locale('commands:rps.replies.paper'): {
                if (result === bot.locale('commands:rps.replies.scissors')) {
                    ctx.followUp({
                        content: bot.locale('commands:rps.clientWon', { result: result }),
                        flags: 64
                    })
                }
                ctx.followUp({
                    content: bot.locale('commands:rps.won2'),
                    flags: 64
                });
            }
            case bot.locale('commands:rps.replies.scissors'): {
                if (result === bot.locale('commands:rps.replies.rock')) {
                    ctx.followUp({
                        content: bot.locale('commands:rps.clientWon', { result: result }),
                        flags: 64
                    });
    
                }
                ctx.followUp({
                    content: bot.locale('commands:rps.won1'),
                    flags: 64
                });
            }
        }
    }
}

export { startRpsGame }