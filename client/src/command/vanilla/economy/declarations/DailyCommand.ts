import { createCommand } from '../../../structures/createCommand';
import DailyExecutor from '../DailyExecutor';

const DailyCommand = createCommand({
    name: 'daily',
    description: '[Economy] Receive your daily cakes',
    descriptionLocalizations: {
        'pt-BR': '[Economia] Receba seus cakes diários'
    },
    category: 'economy',
    supportsLegacy: true,
    execute: async (context, endCommand, t) => {
        DailyExecutor(context, endCommand, t);
    }
});

export default DailyCommand;