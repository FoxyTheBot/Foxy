import { bot } from "../../../FoxyLauncher";
import { User } from "discordeno/transformers";
import { ButtonStyles } from "discordeno/types";
import { createEmbed } from "../../../utils/discord/Embed";
import { MessageFlags } from "../../../utils/discord/Message";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { TransactionType } from "../../../structures/types/transaction";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
export default class AtmExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const user = await context.getOption<User>('user', 'users') ?? context.author;

        if (!user) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
            });

            return endCommand();
        }
        const userData = await bot.database.getUser(user.id);
        const balance = userData.userCakes.balance;

        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_DAILY, t('commands:atm.success', {
                user: await bot.rest.foxy.getUserDisplayName(user.id),
                balance: balance.toLocaleString(t.lng || 'pt-BR')
            }))
        });

        endCommand();
    }
}