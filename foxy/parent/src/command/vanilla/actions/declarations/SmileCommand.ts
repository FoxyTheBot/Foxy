import { createCommand } from '../../../structures/createCommand';
import UnleashedCommandExecutor from '../../../structures/UnleashedCommandExecutor';
import SmileExecutor from '../SmileExecutor';

const SmileCommand = createCommand({
    name: 'smile',
    nameLocalizations: {
        'pt-BR': 'sorrir'
    },
    description: '[Roleplay] * smiling *',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] * sorrindo *"
    },
    category: 'roleplay',
    supportsLegacy: false,

    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
      new SmileExecutor().execute(context, endCommand, t);
    }
});

export default SmileCommand;