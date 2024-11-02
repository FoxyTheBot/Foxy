import { User } from 'discordeno/transformers';
import UnleashedCommandExecutor from '../../../structures/UnleashedCommandExecutor';
import { bot } from '../../../../FoxyLauncher';
import { getUserAvatar } from '../../../../utils/discord/User';

export default class GirlFriendExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const user = await context.getOption<User>("user", "users");
        context.sendDefer();

        if (!user) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:global.noUser')),
                flags: 64
            });

            return endCommand();
        }

        const girlfriendMeme = await bot.rest.foxy.getArtistryImage("/memes/girlfriend", {
            avatar: getUserAvatar(user, { size: 2048 })
        });

        const file = new File([girlfriendMeme], "namorada.png", { type: "image/png" });

        context.reply({
            file: {
                name: "namorada.png",
                blob: file
            }
        });

        return endCommand();
    }
}