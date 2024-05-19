import { createCommand } from '../../../structures/createCommand';
import LanguageExecutor from '../../util/LanguageExecutor';

const LaughCommand = createCommand({
    name: 'laugh',
    nameLocalizations: {
        'pt-BR': 'rir'
    },
    description: '[Roleplay] * giggles *',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] * risadas *"
    },
    category: 'roleplay',
    supportsLegacy: true,

    execute: async (context, endCommand, t) => {
        LanguageExecutor(context, endCommand, t);
    }
});

export default LaughCommand;