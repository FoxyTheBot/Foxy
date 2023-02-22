import { ApplicationCommandOptionTypes } from 'discordeno/types';
import { bot } from '../../index';
import { createCommand } from '../../structures/commands/createCommand';
import { User } from 'discordeno/transformers';
import GenerateImage from '../../structures/GenerateImage';

const ProfileCommand = createCommand({
name: 'perfil',
    nameLocalizations: { 'en-US': 'profile' },
    description: '[👥] Veja seu perfil ou o de outro usuário',
    descriptionLocalizations: { 'en-US': '[👥] View your profile or another user profile' },
    category: 'social',
    options: [
        {
            name: 'user',
            nameLocalizations: { "pt-BR": 'usuário' },
            type: ApplicationCommandOptionTypes.User,
            description: 'Usuário que você quer ver o perfil',
            descriptionLocalizations: { 'en-US': 'User you want to see the profile' },
            required: false
        },
    ],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users') ?? context.author;
        const userData = await bot.database.getUser(user.id);

        if (userData.isBanned) {
            context.sendReply({ content: t('commands:profile.banned', { user: user.username, reason: userData.banReason, date: userData.banData.toLocaleString(global.t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }) });
            return endCommand();
        }

        await context.defer();
        const canvasGenerator = new GenerateImage(t, user, userData, 1436, 884);
        const profile = canvasGenerator.renderProfile();

        context.sendReply({
            content: context.makeReply("🖼", t('commands:profile.profile', { user: `<@${user.id}>` })),
            file: [{ name: 'profile.png', blob: await profile }]
        })
        endCommand();
    },
});

export default ProfileCommand;