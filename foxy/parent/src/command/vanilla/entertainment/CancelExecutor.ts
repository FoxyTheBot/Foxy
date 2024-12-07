import { bot } from "../../../FoxyLauncher";
import { ExtendedUser } from "../../../structures/types/DiscordUser";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class CancelExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const user = await context.getOption<ExtendedUser>('user', 'users');
        const content = context.interaction ? await context.getOption<string>('reason', false) : context.getMessage(2, true);

        if (!user) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:cancel.noUser'))
            });
            return endCommand();
        }

        if (!content) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_RAGE, t('commands:cancel.noReason'))
            });
            return endCommand();
        }

        context.reply({
            content: context.makeReply(bot.emotes.FOXY_SCARED, t('commands:cancel.result', { user: await bot.rest.foxy.getUserDisplayName((await context.getAuthor()).id), reason: content, mention: user.asMention }))
        })

        return endCommand();
    }
};