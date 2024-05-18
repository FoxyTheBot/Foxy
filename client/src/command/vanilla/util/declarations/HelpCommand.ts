import { createCommand } from '../../../structures/createCommand';
import HelpExecutor, { HelpLegacyExecutor } from '../HelpExecutor';

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
    execute: async (context, endCommand, t) => {
      HelpExecutor(context, endCommand, t);  
    },

    executeAsLegacy(message, args, t) {
        return HelpLegacyExecutor(message, args, t);
    },
});

export default HelpCommand;