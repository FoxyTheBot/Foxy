import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";
import { bot } from "../../../index";
import { createButton, createCustomId, createActionRow } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import { User } from "discordeno/transformers";
import { MessageFlags } from "../../../utils/discord/Message";

export default async function MarryExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const user = context.getOption<User>('user', 'users');
    const subCommand = context.getSubCommand();

    switch (subCommand) {
        case "ask": {
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
                    customId: createCustomId(0, user.id, context.commandId),
                    label: t('commands:marry.accept'),
                    emoji: {
                        name: "💍"
                    },
                    style: ButtonStyles.Success
                })])],
            });

            endCommand();
            break;
        }

        case "lock_requests": {
            const status = context.getOption<boolean>('lock', false);
            const userData = await bot.database.getUser(context.author.id);

            if (userData.marryStatus.cantMarry) {
                context.sendReply({
                    content: t('commands:profile.marriableStatusAlreadySet', { status: status ? t('commands:profile.simpleYes') : t('commands:profile.simpleNo') }),
                    flags: MessageFlags.EPHEMERAL
                });
                return endCommand();
            } else {
                userData.marryStatus.cantMarry = status;
                await userData.save();

                context.sendReply({
                    content: t('commands:profile.marriableStatusSet', { status: status ? t('commands:profile.yes') : t('commands:profile.no') }),
                    flags: MessageFlags.EPHEMERAL
                });

                endCommand();
                break;
            }
        }
    }
}