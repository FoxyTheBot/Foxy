import { createCommand } from '../../../structures/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import TickleButtonExecutor from '../components/TickleButtonExecutor';
import TickleExecutor from '../TickleExecutor';
import UnleashedCommandExecutor from '../../../structures/UnleashedCommandExecutor';

const tickleCommand = createCommand({
    name: 'tickle',
    nameLocalizations: {
        'pt-BR': 'cócegas'
    },
    description: '[Roleplay] tickle someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Faça cócegas em alguém"
    },
    category: 'roleplay',
    supportsLegacy: false,
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to tickle",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja fazer cócegas"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [TickleButtonExecutor],
    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
       TickleExecutor(context, endCommand, t);
    }
});

export default tickleCommand;