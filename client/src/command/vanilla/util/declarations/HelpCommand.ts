import { createCommand } from '../../../structures/createCommand';
import HelpExecutor from '../HelpExecutor';

const HelpCommand = createCommand({
    name: 'help',
    nameLocalizations: {
        "pt-BR": "ajuda"
    },
    description: '[Utils] Shows the help message',
    descriptionLocalizations: {
        "pt-BR": '[Utilitários] Mostra a mensagem de ajuda'
    },
    category: 'util',
    supportsLegacy: false,
    aliases: ['ajuda', 'commands', 'comandos'],
    execute: async (context, endCommand, t) => {
        HelpExecutor(context, endCommand, t);
    },
});

export default HelpCommand;