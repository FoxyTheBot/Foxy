import { bot } from "../../../FoxyLauncher";
import { ExtendedUser } from "../../../structures/types/DiscordUser";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class AtmExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const user = context.interaction && context.interaction.data?.targetId
            ? await bot.helpers.foxy.getUser(context.interaction.data.targetId)
            : (await context.getOption<ExtendedUser>('user', 'users') || (await context.getAuthor()));

        if (!user) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
            });

            return endCommand();
        }
        const userData = await bot.database.getUser(user.id);
        const balance = userData.userCakes.balance;

        context.reply({
            content: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:atm.success', {
                user: user.asMention,
                balance: balance.toLocaleString(t.lng || 'pt-BR')
            })),
            flags: context.interaction?.data?.targetId ? 64 : 0
        });

        endCommand();
    }
}