import { createCommand } from '../../../structures/createCommand';
import { ApplicationCommandOptionTypes } from 'discordeno/types';
import BackgroundSetExecutor from '../components/BackgroundSetExecutor';
import MaskSetExecutor from '../components/MaskSetExecutor';
import ChangeExecutor from '../ChangeExecutor';

const ChangeCommand = createCommand({
    name: "change",
    nameLocalizations: {
        "pt-BR": "alterar"
    },
    description: "[Economy] Change your profile background or avatar decoration",
    descriptionLocalizations: {
        "pt-BR": "[Economia] Altere o background ou a decoração de avatar do seu perfil"
    },
    category: "economy",
    options: [{
        name: "background",
        description: "[Economy] Change your profile background",
        descriptionLocalizations: {
            "pt-BR": "[Economia] Altere o background do seu perfil"
        },
        type: ApplicationCommandOptionTypes.SubCommand
    },
    {
        name: "avatar_decoration",
        nameLocalizations: {
            'pt-BR': 'decoração_de_avatar'
        },
        description: '[Economy] Change your profile avatar decoration',
        descriptionLocalizations: {
            'pt-BR': '[Economia] Mude a decoração de avatar do seu perfil'
        },
        type: ApplicationCommandOptionTypes.SubCommand
    }],
    commandRelatedExecutions: [
        BackgroundSetExecutor, // 0
        MaskSetExecutor // 1
    ],

    async execute(context, endCommand, t) {
        ChangeExecutor(context, endCommand, t);
    }
});

export default ChangeCommand;