import { bot } from '../../../FoxyLauncher';
import { User } from 'discordeno/transformers';
import CreateProfile from '../../../utils/images/generators/GenerateProfile';
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function ProfileExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>('user', 'users') ?? context.author;
    const userData = await bot.database.getUser(user.id);

    await context.sendDefer();
    const createProfile = new CreateProfile(t, user, userData);
    const profile = createProfile.create();

    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_NICE, t('commands:profile.profile', { user: `<@${user.id}>` })),
        file: [{ name: 'profile.png', blob: await profile }]
    });
    return endCommand();
}
