import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { bot } from '../../index';
import { createCommand } from '../../structures/commands/createCommand';
import { User } from 'discordeno/transformers';
import CreateProfile from '../../utils/commands/generators/GenerateProfile';

const ProfileCommand = createCommand({
    name: 'profile',
    nameLocalizations: { 'pt-BR': 'perfil' },
    description: '[Social] View your profile or another user profile',
    descriptionLocalizations: { 'pt-BR': '[Social] Veja seu perfil ou o de outro usuário' },
    category: 'social',
    options: [
        {
            name: 'user',
            nameLocalizations: { "pt-BR": 'usuário' },
            type: ApplicationCommandOptionTypes.User,
            description: 'User you want to see the profile',
            descriptionLocalizations: { 'pt-BR': 'Usuário que você quer ver o perfil' },
            required: false
        },
    ],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users') ?? context.author;
        const userData = await bot.database.getUser(user.id);

        if (userData.isBanned) {
            context.sendReply({
                content: t('commands:profile.banned', { user: user.username, reason: userData.banReason, date: userData.banData.toLocaleString(global.t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) })
            });
            return endCommand();
        }

        await context.sendDefer();
        const createProfile = new CreateProfile(t, user, userData);
        const profile = createProfile.create();

        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:profile.profile', { user: `<@${user.id}>` })),
            file: [{ name: 'profile.png', blob: await profile }]
        })
        return endCommand();
    },
});

export default ProfileCommand;