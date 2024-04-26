import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { bot } from "../../..";
import { User } from "discordeno/transformers";

export default async function CancelExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const user = context.getOption<User>('user', 'users');
    const content = context.getOption<string>('reason', false);

    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_SCARED, t('commands:cancel.result', { user: await bot.foxyRest.getUserDisplayName(context.author.id), reason: content, mention: `<@!${user.id}>` }))
    })

    endCommand();
};