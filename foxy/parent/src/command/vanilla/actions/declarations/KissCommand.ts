import { createCommand } from '../../../structures/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import KissButtonExecutor from "../components/KissButtonExecutor";
import UnleashedCommandExecutor from '../../../structures/UnleashedCommandExecutor';
import KissExecutor from '../KissExecutor';


const KissCommand = createCommand({
    name: 'kiss',
    nameLocalizations: {
        'pt-BR': 'beijar'
    },
    description: '[Roleplay] Kiss someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Beije alguém"
    },
    category: 'roleplay',
    supportsLegacy: true,
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to kiss",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja beijar"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    commandRelatedExecutions: [KissButtonExecutor],
    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        new KissExecutor().execute(context, endCommand, t);
    }
});

export default KissCommand;