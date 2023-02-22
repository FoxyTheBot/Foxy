import { createCommand } from "../../structures/commands/createCommand";
import { User } from "discordeno/transformers";
import { ApplicationCommandOptionTypes } from "discordeno/types";

const cancelCommand = createCommand({
name: 'cancelar',
    nameLocalizations: {
        'en-US': 'cancel'
    },
    description: "[📺] Cancela alguém",
    descriptionLocalizations: {
        "en-US": "[📺] Cancel someone"
    },
    category: 'fun',
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Usuário que você quer cancelar",
            descriptionLocalizations: {
                "en-US": "User you want to cancel"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        },
        {
            name: "reason",
            nameLocalizations: {
                "pt-BR": "motivo"
            },
            description: "Motivo do cancelamento",
            descriptionLocalizations: {
                "en-US": "Reason for the cancellation"
            },
            type: ApplicationCommandOptionTypes.String,
            required: true
        }
    ],

    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users');
        const string = context.getOption<string>('reason', false);

        context.sendReply({
            content: context.makeReply("❌", t('commands:cancel.result', { user: context.author.username, reason: string, mention: `<@!${user.id}>` }))
        })
    
        endCommand();
    }
});

export default cancelCommand;