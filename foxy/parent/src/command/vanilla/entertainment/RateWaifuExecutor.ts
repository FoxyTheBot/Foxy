import { User } from "discordeno/transformers";
import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class RateWaifuExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const user = await context.getOption<User>('user', 'users') ?? context.author;

        if (!user) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
            });
            return endCommand();
        }

        const result = Math.floor(Math.random() * 10) + 1;
        context.reply({
            content: context.makeReply(bot.emotes.FOXY_THINK, t('commands:rate.result', { user: await bot.rest.foxy.getUserDisplayName(user.id), rate: result.toString() }))
        });

        endCommand();
    }
}