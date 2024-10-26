import { createCommand } from '../../../structures/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import GirlFriendExecutor from '../GirlfriendExecutor';

const GirlfriendCommand = createCommand({
    name: "girlfriend",
    description: "[Image] Who is your girlfriend?",
    descriptionLocalizations: {
        "pt-BR": "[Imagem] Quem é a sua namorada?"
    },
    category: "image",
    supportsLegacy: false,
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Mention the user (or not...)",
            descriptionLocalizations: {
                "pt-BR": "Mencione o usuário (ou não...)"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    execute: async (context, endCommand, t) => {
        GirlFriendExecutor(context, endCommand, t);
    }
});

export default GirlfriendCommand;