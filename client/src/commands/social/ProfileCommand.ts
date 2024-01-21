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
        const subcommand = context.getSubCommand();

        switch (subcommand) {
            case 'view': {
                const user = context.getOption<User>('user', 'users') ?? context.author;
                const userData = await bot.database.getUser(user.id);

                if (userData.isBanned) {
                    context.sendReply({
                        content: context.makeReply(bot.emotes.FOXY_RAGE, t('commands:profile.banned', { user: await bot.foxyRest.getUserDisplayName(user.id), reason: userData.banReason, date: userData.banData.toLocaleString(global.t.lng, { timeZone: "America/Sao_Paulo", hour: '2-digit', minute: '2-digit', year: 'numeric', month: 'numeric', day: 'numeric' }) }))
                    });
                    return endCommand();
                }

                await context.sendDefer();
                const createProfile = new CreateProfile(t, user, userData);
                const profile = createProfile.create();

                context.sendReply({
                    content: context.makeReply(bot.emotes.FOXY_NICE, t('commands:profile.profile', { user: `<@${user.id}>` })),
                    file: [{ name: 'profile.png', blob: await profile }]
                })
                return endCommand();
            }
        }
    }
});

export default ProfileCommand;