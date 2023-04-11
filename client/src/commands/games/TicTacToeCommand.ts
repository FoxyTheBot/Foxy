import { bot } from "../..";
import { createCommand } from "../../structures/commands/createCommand";
import TicTacToeDecline from "../../utils/commands/executors/games/TicTacToeDeclineExecutor";
import { TicTacToeExecutor, TicTacToeFirstExecutor } from "../../utils/commands/executors/games/TicTacToeExecutor";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import { User } from "discordeno/transformers";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";

const TicTacToeCommand = createCommand({
    name: "tictactoe",
    nameLocalizations: {
        "pt-BR": "jogodavelha"
    },
    description: "[Games] Play Tic Tac Toe with someone",
    descriptionLocalizations: {
        "pt-BR": "[Jogos] Jogue Jogo da Velha com alguém"
    },
    category: "games",
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to play with",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário com quem deseja jogar"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [TicTacToeFirstExecutor, TicTacToeDecline, TicTacToeExecutor],
    
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>("user", "users");
        
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_THINK, t('commands:tictactoe.request', {
                user: user.username,
                author: context.author.username
            })),
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, context.commandId, user.username, user.id),
                label: t('commands:tictactoe.accept'),
                style: ButtonStyles.Success
            }), createButton({
                customId: createCustomId(1, user.id, context.commandId, user.username, user.id),
                label: t('commands:tictactoe.decline'),
                style: ButtonStyles.Danger
            })])]
        });

        endCommand();
    }
});

export default TicTacToeCommand;