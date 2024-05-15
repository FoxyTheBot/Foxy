import { User } from "discordeno/transformers";
import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { bot } from "../../../FoxyLauncher";

export default async function FateExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const user = context.getOption<User>('user', 'users');

    if (!user) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_SCARED, t('commands:global.noUser'))
        })
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
    await context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:fate.result', { user: context.author.id.toString(), fate: rand, mention: user.id.toString() }))
    });

    endCommand();
}