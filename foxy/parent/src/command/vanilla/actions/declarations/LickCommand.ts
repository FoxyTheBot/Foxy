import { createCommand } from '../../../structures/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import LickButtonExecutor from '../components/LickButtonExecutor';
import LickExecutor from '../LickExecutor';

const LickCommand = createCommand({
    name: 'lick',
    nameLocalizations: {
        'pt-BR': 'lamber'
    },
    description: '[Roleplay] Lick someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Lamba alguém"
    },
    category: 'roleplay',
    supportsLegacy: true,
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to lick",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja lamber"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [LickButtonExecutor],
    execute: async (context, endCommand, t) => {
        LickExecutor(context, endCommand, t);
    }
});

export default LickCommand;