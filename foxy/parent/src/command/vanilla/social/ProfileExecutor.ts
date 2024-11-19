import { bot } from '../../../FoxyLauncher';
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { ExtendedUser } from '../../../structures/types/DiscordUser';

export default class ProfileExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const user = context.interaction && context.interaction.data?.targetId
            ? await bot.foxy.helpers.getUser(context.interaction.data.targetId)
            : (await context.getOption<ExtendedUser>('user', 'users') || (await context.getAuthor()));

        const userData = await bot.database.getUser(user.id);

        await context.sendDefer();
        const profileImage = await bot.generators.generateProfile(t, user, userData);

        context.reply({
            content: context.makeReply(bot.emotes.FOXY_NICE, t('commands:profile.profile', { user: user.asMention })),
            file: [{ name: 'profile.png', blob: profileImage }]
        });
        return endCommand();
    }
}
