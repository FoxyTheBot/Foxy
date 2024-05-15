import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { bot } from '../../../../FoxyLauncher';
import { createCommand } from '../../../structures/createCommand';
import { User } from 'discordeno/transformers';
import CreateProfile from '../../../../utils/images/generators/GenerateProfile';
import ProfileExecutor from '../ProfileExecutor';

const ProfileCommand = createCommand({
    name: 'profile',
    nameLocalizations: { 'pt-BR': 'perfil' },
    description: '[Social] View your profile or another user profile',
    descriptionLocalizations: { 'pt-BR': '[Social] Veja seu perfil ou o de outro usuário' },
    category: 'social',
    options: [{
        name: "view",
        nameLocalizations: {
            "pt-BR": "ver"
        },
        description: "[Social] View your profile or another user profile",
        descriptionLocalizations: { 'pt-BR': '[Social] Veja o seu perfil ou de outro usuário' },
        type: ApplicationCommandOptionTypes.SubCommand,
        options: [{
            name: 'user',
            description: 'User to view the profile',
            descriptionLocalizations: { 'pt-BR': 'Usuário para ver o perfil' },
            type: ApplicationCommandOptionTypes.User,
            required: false
        }]
    }],
    execute: async (context, endCommand, t) => {
        ProfileExecutor(context, endCommand, t);
    }
});

export default ProfileCommand;