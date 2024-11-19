import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { ExtendedUser } from "../../../structures/types/DiscordUser";

export default class FateExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const user = await context.getOption<ExtendedUser>('user', 'users');

        if (!user) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_SCARED, t('commands:global.noUser'))
            });

            return endCommand();
        }

        const list = [
            t('commands:fate.couple'),
            t('commands:fate.friend'),
            t('commands:fate.lover'),
            t('commands:fate.enemy'),
            t('commands:fate.sibling'),
            t('commands:fate.parent'),
            t('commands:fate.married')
        ]

        const rand = list[Math.floor(Math.random() * list.length)];
        await context.reply({
            content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:fate.result', { user: (await context.getAuthor()).id.toString(), fate: rand, mention: user.id.toString() }))
        });

        endCommand();
    }
}