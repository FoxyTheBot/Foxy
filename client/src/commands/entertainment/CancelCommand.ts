import { createCommand } from "../../structures/commands/createCommand";
import { User } from "discordeno/transformers";
import { ApplicationCommandOptionTypes } from "discordeno/types";
import { bot } from '../../index';

const cancelCommand = createCommand({
    name: 'cancel',
    nameLocalizations: {
        'pt-BR': 'cancelar'
    },
    description: "[Entertainment] Cancel someone",
    descriptionLocalizations: {
        "pt-BR": "[Entretenimento] Cancela alguém"
    },
    category: 'fun',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "User you want to cancel",
            descriptionLocalizations: {
                "pt-BR": "Usuário que você quer cancelar"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        },
        {
            name: "reason",
            nameLocalizations: {
                "pt-BR": "motivo"
            },
            description: "Reason for the cancellation",
            descriptionLocalizations: {
                "pt-BR": "Motivo do cancelamento"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users');
        const string = context.getOption<string>('reason', false);

        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_SCARED, t('commands:cancel.result', { user: context.author.username, reason: string, mention: `<@!${user.id}>` }))
        })

        endCommand();
    }
});

export default cancelCommand;