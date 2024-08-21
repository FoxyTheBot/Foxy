import { bot } from '../../../FoxyLauncher';
import { User } from 'discordeno/transformers';
import CreateProfile from '../../../utils/images/generators/GenerateProfile';
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function ProfileExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    let user = await context.getOption<User>('user', 'users') ?? context.author;
    if (context.interaction.data.targetId) user = await bot.helpers.getUser(context.interaction.data.targetId);
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
