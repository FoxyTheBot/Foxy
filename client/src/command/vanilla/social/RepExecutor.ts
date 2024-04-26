import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { User } from "discordeno/transformers";
import { bot } from "../../../index";
import ms from "ms";
import { MessageFlags } from "../../../utils/discord/Message";

export default async function RepExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const user = context.getOption<User>('user', 'users');
    if (!user) {
        context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'));
        return endCommand();
    }

    if (user.id === context.author.id) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:rep.self'))
        })
        return endCommand();
    }

    const userData = await bot.database.getUser(user.id);
    const authorData = await bot.database.getUser(context.author.id);
    const repCooldown = 3600000;

    if (repCooldown - (Date.now() - authorData.lastRep) > 0) {
        const currentCooldown = ms(repCooldown - (Date.now() - authorData.lastRep));
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:rep.cooldown', { cooldown: currentCooldown })),
            flags: MessageFlags.EPHEMERAL
        })
        endCommand();
    } else {
        if (userData.premiumType === '3') {
            userData.repCount += 2;
        } else {
            userData.repCount++;
        }
        authorData.lastRep = Date.now();
        authorData.save();
        userData.save();
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:rep.success', { user: await bot.foxyRest.getUserDisplayName(user.id) }))
        })
        endCommand();
    }
}