import { createCommand } from '../../../structures/createCommand';
import ProfileExecutor from '../ProfileExecutor';
import UnleashedCommandExecutor from '../../../structures/UnleashedCommandExecutor';
import { ApplicationCommandOptionTypes } from 'discordeno/types';

const ProfileCommand = createCommand({
    name: 'profile',
    nameLocalizations: { 'pt-BR': 'perfil' },
    description: '[Social] View your profile or another user profile',
    descriptionLocalizations: { 'pt-BR': '[Social] Veja seu perfil ou o de outro usuário' },
    category: 'social',
    aliases: ['perfil', 'perfil'],
    supportsLegacy: true,

    options: [{
        name: 'user',
        nameLocalizations: { 'pt-BR': 'usuário' },
        description: 'User you want to view the profile',
        descriptionLocalizations: { 'pt-BR': 'Usuário que você quer ver o perfil' },
        type: ApplicationCommandOptionTypes.User,
        required: false
    }],

    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        new ProfileExecutor().execute({ context, endCommand, t });
    },
});

export default ProfileCommand;