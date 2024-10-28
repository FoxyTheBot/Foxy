import { User } from 'discordeno/transformers';
import UnleashedCommandExecutor from '../../structures/UnleashedCommandExecutor';
import { bot } from '../../../FoxyLauncher';

export default async function GirlFriendExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>("user", "users");
    context.sendDefer();

    if (!user) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:global.noUser')),
            flags: 64
        });

        return endCommand();
    }
    
    const girlfriendMeme = await bot.generators.generateGirlfriendImage(user);;

    context.sendReply({
        file: {
            name: "namorada.png",
            blob: girlfriendMeme
        }
    });

    return endCommand();
}