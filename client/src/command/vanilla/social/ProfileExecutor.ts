import { bot } from '../../../FoxyLauncher';
import { User } from 'discordeno/transformers';
import CreateProfile from '../../../utils/images/generators/GenerateProfile';
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function ProfileExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const subcommand = context.getSubCommand();
    console.log(subcommand)
    switch (subcommand) {
        case 'view':
        case 'profile': {
            const user = await context.getOption<User>('user', 'users') ?? context.author;
            console.log(user);
            const userData = await bot.database.getUser(user.id);

            if (userData.isBanned) {
                context.sendReply({
                    content: context.makeReply(
                        bot.emotes.FOXY_RAGE,
                        t('commands:profile.banned', {
                            user: await bot.foxyRest.getUserDisplayName(user.id),
                            reason: userData.banReason,
                            date: userData.banDate.toLocaleString(global.t.lng, {
                                timeZone: "America/Sao_Paulo",
                                hour: '2-digit',
                                minute: '2-digit',
                                year: 'numeric',
                                month: 'numeric',
                                day: 'numeric'
                            })
                        })
                    )
                });
                return endCommand();
            }

            await context.sendDefer();
            const createProfile = new CreateProfile(t, user, userData);
            const profile = createProfile.create();

            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_NICE, t('commands:profile.profile', { user: `<@${user.id}>` })),
                file: [{ name: 'profile.png', blob: await profile }]
            });
            return endCommand();
        }
    }
}