import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";

const TicTacToeDecline = async (context: ComponentInteractionContext) => {
    const [username, userId] = context.sentData;

    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_THINK, bot.locale('commands:tictactoe.declined')),
        components: [createActionRow([createButton({
            customId: createCustomId(0, userId, context.commandId, username, userId),
            label: bot.locale('commands:tictactoe.accept'),
            style: ButtonStyles.Success,
            emoji: {
                id: bot.emotes.FOXY_YAY
            },
            disabled: true
        }), createButton({
            customId: createCustomId(1, userId, context.commandId, username, userId),
            label: bot.locale('commands:tictactoe.decline'),
            style: ButtonStyles.Danger,
            emoji: {
                id: bot.emotes.FOXY_CRY
            },
            disabled: true
        })])]
    })
}

export default TicTacToeDecline;