import { User } from "discordeno/transformers";
import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { bot } from "../../../FoxyLauncher";

export default async function RateWaifuExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const user = context.getOption<User>('user', 'users');

    const result = Math.floor(Math.random() * 10) + 1;
    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_THINK, t('commands:rate.result', { user: await bot.foxyRest.getUserDisplayName(user.id), rate: result.toString() }))
    });

    endCommand();
}