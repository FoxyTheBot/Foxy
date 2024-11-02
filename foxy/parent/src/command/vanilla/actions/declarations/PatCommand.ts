import { createCommand } from '../../../structures/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import PatButtonExecutor from '../components/PatButtonExecutor';
import PatExecutor from '../PatExecutor';
import UnleashedCommandExecutor from '../../../structures/UnleashedCommandExecutor';

const patCommand = createCommand({
    name: 'pat',
    nameLocalizations: {
        'pt-BR': 'carinho'
    },
    description: '[Roleplay] pat someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Faça carinho em alguém"
    },
    category: 'roleplay',
    supportsLegacy: true,
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to pat",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja fazer carinho"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [PatButtonExecutor],
    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        new PatExecutor().execute(context, endCommand, t);
    }
});

export default patCommand;