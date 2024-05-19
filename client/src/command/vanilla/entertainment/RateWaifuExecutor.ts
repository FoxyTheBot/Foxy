import { User } from "discordeno/transformers";
import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function RateWaifuExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>('user', 'users') ?? context.author;

    const result = Math.floor(Math.random() * 10) + 1;
    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_THINK, t('commands:rate.result', { user: await bot.foxyRest.getUserDisplayName(user.id), rate: result.toString() }))
    });

    endCommand();
}