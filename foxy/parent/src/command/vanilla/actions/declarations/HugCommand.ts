import { createCommand } from '../../../structures/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import HugButtonExecutor from '../components/HugButtonExecutor';
import UnleashedCommandExecutor from '../../../structures/UnleashedCommandExecutor';
import HugExecutor from '../HugExecutor';

const HugCommand = createCommand({
    name: 'hug',
    nameLocalizations: {
        'pt-BR': 'abraçar'
    },
    description: '[Roleplay] Hug someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Abraçe alguém"
    },
    category: 'roleplay',
    supportsLegacy: true,
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to hug",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja abraçar"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [HugButtonExecutor],
    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
       HugExecutor(context, endCommand, t); 
    }
});

export default HugCommand;