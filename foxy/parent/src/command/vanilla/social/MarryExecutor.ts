import { bot } from "../../../FoxyLauncher";
import { createButton, createCustomId, createActionRow } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";
import { ExtendedUser } from "../../../structures/types/DiscordUser";

export default class MarryExecutor {
    async execute(context: UnleashedCommandExecutor, endCommand, t) {
        const user = await context.getOption<ExtendedUser>('user', 'users');
        if (!user) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:global.noUser'))
            })
            return endCommand();
        }

        if (user.id === (await context.getAuthor()).id) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.self'))
            })
            return endCommand();
        }

        if (user.id === bot.id) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.bot'))
            })
            return endCommand();
        }

        const userData = await bot.database.getUser((await context.getAuthor()).id);
        const futurePartnerData = await bot.database.getUser(user.id);

        if (futurePartnerData.marryStatus.marriedWith) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarriedWithSomeone'))
            })
            return endCommand();
        }

        if (userData.marryStatus.marriedWith) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarried'))
            })
            return endCommand();
        }

        if (String(user.id) === userData.marryStatus.marriedWith) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarriedWithUser', { user: await bot.rest.foxy.getUserDisplayName(user.id) }))
            })
            return endCommand();
        }

        context.reply({
            content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:marry.ask', { user: await bot.rest.foxy.getUserDisplayName(user.id), author: await bot.rest.foxy.getUserDisplayName((await context.getAuthor()).id) })),
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

        return endCommand();
    }
}