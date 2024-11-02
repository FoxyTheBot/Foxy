import { createCommand } from '../../../structures/createCommand';
import DanceExecutor from '../DanceExecutor';
import UnleashedCommandExecutor from '../../../structures/UnleashedCommandExecutor';

const DanceCommand = createCommand({
    name: 'dance',
    nameLocalizations: {
        'pt-BR': 'dançar'
    },
    description: '[Roleplay] * grooving *',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] * dançando *"
    },
    category: 'roleplay',
    supportsLegacy: false,

    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        DanceExecutor(context, endCommand, t);
    }
});

export default DanceCommand;