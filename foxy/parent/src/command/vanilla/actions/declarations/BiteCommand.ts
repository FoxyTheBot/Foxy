import { createCommand } from '../../../structures/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import BiteExecutor from '../BiteExecutor';

const BiteCommand = createCommand({
    name: 'bite',
    nameLocalizations: {
        'pt-BR': 'morder'
    },
    description: '[Roleplay] Bite someone',
    descriptionLocalizations: {
        "pt-BR": "[Roleplay] Morda alguém"
    },
    category: 'roleplay',
    supportsLegacy: false,
    options: [
        {
            name: "user",
            nameLocalizations: {
                "pt-BR": "usuário"
            },
            description: "Select the user you want to bite",
            descriptionLocalizations: {
                "pt-BR": "Selecione o usuário que deseja morder"
            },
            type: ApplicationCommandOptionTypes.User,
            required: true
        }
    ],
    execute: async (context, endCommand, t) => {
        new BiteExecutor().execute({ context, endCommand, t });
    }
});

export default BiteCommand;