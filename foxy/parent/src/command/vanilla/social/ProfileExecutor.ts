import { bot } from '../../../FoxyLauncher';
import { ExtendedUser } from '../../../structures/types/DiscordUser';
import { ExecutorParams } from '../../structures/CommandExecutor';

export default class ProfileExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const user = context.interaction && context.interaction.data?.targetId
            ? await bot.helpers.foxy.getUser(context.interaction.data.targetId)
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
