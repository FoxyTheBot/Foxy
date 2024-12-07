import { createCommand } from '../../../structures/createCommand';
import CryExecutor from '../CryExecutor';
import UnleashedCommandExecutor from '../../../structures/UnleashedCommandExecutor';

const CryCommand = createCommand({
    name: 'cry',
    nameLocalizations: {
        'pt-BR': 'chorar'
    },
    description: '[Roleplay] * crying *',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] * chorando *"
    },
    category: 'roleplay',
    supportsLegacy: false,

    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        new CryExecutor().execute({ context, endCommand, t });
    }
});

export default CryCommand;