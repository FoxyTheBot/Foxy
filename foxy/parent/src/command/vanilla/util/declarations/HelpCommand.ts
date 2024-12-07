import { IntegrationContexts, IntegrationTypes } from '../../../../structures/types/CommandInterfaces';
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
    supportsLegacy: true,
    integrationTypes: [IntegrationTypes.GUILD_INSTALL, IntegrationTypes.USER_INSTALL],
    contexts: [IntegrationContexts.BOT_DM, IntegrationContexts.GUILD, IntegrationContexts.PRIVATE_CHANNEL],
    aliases: ['ajuda', 'commands', 'comandos'],
    execute: async (context, endCommand, t) => {
        new HelpExecutor().execute({ context, endCommand, t });
    },
});

export default HelpCommand;