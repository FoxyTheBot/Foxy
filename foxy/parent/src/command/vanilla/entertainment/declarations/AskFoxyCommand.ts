import { createCommand } from '../../../structures/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import AskFoxyExecutor from '../AskFoxyExecutor';

const AskFoxyCommand = createCommand({
    name: 'ask',
    description: '[Entertainment] Ask something to Foxy',
    descriptionLocalizations: {
        'pt-BR': '[Entretenimento] Pergunte algo para a Foxy'
    },
    category: 'games',
    supportsLegacy: true,
    options: [{
        name: "foxy",
        description: "[Entertainment] Ask something to Foxy",
        descriptionLocalizations: {
            "pt-BR": "[Entretenimento] Pergunte algo para a Foxy"
        },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [
            {
                name: 'question',
                nameLocalizations: {
                    'pt-BR': 'pergunta'
                },
                description: 'Question you want to ask',
                descriptionLocalizations: {
                    'pt-BR': 'Pergunta que você quer fazer'
                },
                type: ApplicationCommandOptionTypes.String,
                required: true
            }
        ],
    }],
    execute: async (context, endCommand, t) => {
        new AskFoxyExecutor().execute(context, t, endCommand);
    }
});

export default AskFoxyCommand;