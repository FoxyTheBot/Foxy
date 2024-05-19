import { bot } from "../../../FoxyLauncher";
import { createButton, createCustomId, createActionRow } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import { User } from "discordeno/transformers";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function MarryExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const user = await context.getOption<User>('user', 'users');
    if (!user) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
        })
        return endCommand();
    }

    if (user.id === context.author.id) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.self'))
        })
        return endCommand();
    }

    if (user.id === bot.id) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.bot'))
        })
        return endCommand();
    }

    const userData = await bot.database.getUser(context.author.id);
    const futurePartnerData = await bot.database.getUser(user.id);

    if (futurePartnerData.marryStatus.marriedWith) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarriedWithSomeone'))
        })
        return endCommand();
    }

    if (futurePartnerData.marryStatus.cantMarry) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.userNotMarriable', { user: await bot.foxyRest.getUserDisplayName(user.id) }))
        })
        return endCommand();
    }

    if (userData.marryStatus.cantMarry) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.authorNotMarriable'))
        })
        return endCommand();
    }

    if (userData.marryStatus.marriedWith) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarried'))
        })
        return endCommand();
    }

    if (String(user.id) === userData.marryStatus.marriedWith) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarriedWithUser', { user: await bot.foxyRest.getUserDisplayName(user.id) }))
        })
        return endCommand();
    }

    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:marry.ask', { user: await bot.foxyRest.getUserDisplayName(user.id), author: await bot.foxyRest.getUserDisplayName(context.author.id) })),
        components: [createActionRow([createButton({
            customId: createCustomId(0, 
                user.id, 
                context.commandId, 
                context.isMessage ? context.message.id : null,
                context.isMessage ? context.channelId : null
            ),
            label: t('commands:marry.accept'),
            emoji: {
                name: "💍"
            },
            style: ButtonStyles.Success
        })])],
    });

    endCommand();
}