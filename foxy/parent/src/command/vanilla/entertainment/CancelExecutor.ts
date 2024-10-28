import { bot } from "../../../FoxyLauncher";
import { User } from "discordeno/transformers";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function CancelExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>('user', 'users');
    const content = context.getOption<string>('reason', false, null, 2);
    if (!user) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_DRINKING_COFFEE, t('commands:cancel.noUser'))
        });
        return endCommand();
    }

    if (!content) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_RAGE, t('commands:cancel.noReason'))
        });
        return endCommand();
    }
    
    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_SCARED, t('commands:cancel.result', { user: await bot.rest.foxy.getUserDisplayName(context.author.id), reason: content, mention: `<@!${user.id}>` }))
    })

    endCommand();
};