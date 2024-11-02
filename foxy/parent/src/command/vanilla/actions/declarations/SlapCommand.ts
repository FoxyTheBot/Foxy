import { createCommand } from '../../../structures/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import SlapButtonExecutor from '../components/SlapButtonExecutor';
import SlapExecutor from '../SlapExecutor';
import UnleashedCommandExecutor from '../../../structures/UnleashedCommandExecutor';

const SlapCommand = createCommand({
    name: 'slap',
    nameLocalizations: {
        'pt-BR': 'tapa'
    },
    description: '[Roleplay] Slaps someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Dê um tapa em alguém"
    },
    category: 'roleplay',
    supportsLegacy: true,
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to slap",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja bater"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [SlapButtonExecutor],
    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        new SlapExecutor().execute(context, endCommand, t);
    }
});

export default SlapCommand;