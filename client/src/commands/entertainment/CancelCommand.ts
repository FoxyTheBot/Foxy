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

    execute: async (ctx, endCommand, t) => {
        const user = ctx.getOption<User>('user', 'users');
        const string = ctx.getOption<string>('reason', false);

        ctx.foxyReply({
            content: ctx.makeReply("❌", t('commands:cancel.result', { user: ctx.author.username, reason: string, mention: `<@!${user.id}>` }))
        })
    
        endCommand();
    }
});

export default cancelCommand;