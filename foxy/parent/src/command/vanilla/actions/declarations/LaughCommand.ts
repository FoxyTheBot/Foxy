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
    supportsLegacy: false,

    execute: async (context, endCommand, t) => {
        new LanguageExecutor().execute(context, endCommand, t);
    }
});

export default LaughCommand;