import { createCommand } from '../../../structures/createCommand';
import ProfileExecutor from '../ProfileExecutor';
import UnleashedCommandExecutor from '../../../structures/UnleashedCommandExecutor';

const ProfileCommand = createCommand({
    name: 'profile',
    nameLocalizations: { 'pt-BR': 'perfil' },
    description: '[Social] View your profile or another user profile',
    descriptionLocalizations: { 'pt-BR': '[Social] Veja seu perfil ou o de outro usuário' },
    category: 'social',
    aliases: ['perfil', 'view'],
    supportsLegacy: true,
    execute: async (context: UnleashedCommandExecutor, endCommand, t) => {
        ProfileExecutor(context, endCommand, t);
    },
});

export default ProfileCommand;