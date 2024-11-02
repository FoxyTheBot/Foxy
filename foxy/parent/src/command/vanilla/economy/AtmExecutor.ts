import { bot } from "../../../FoxyLauncher";
import { User } from "discordeno/transformers";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default class AtmExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const user = context.interaction && context.interaction.data?.targetId
            ? await bot.helpers.getUser(context.interaction.data.targetId)
            : (await context.getOption<User>('user', 'users') || context.author);

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
                user: await bot.rest.foxy.getUserDisplayName(user.id),
                balance: balance.toLocaleString(t.lng || 'pt-BR')
            })),
            flags: context.interaction?.data?.targetId ? 64 : 0
        });

        endCommand();
    }
}