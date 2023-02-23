import { bot } from "../../index";
import { createCommand } from "../../structures/commands/createCommand";
import { createButton, createCustomId, createActionRow } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { User } from "discordeno/transformers";
import MarryExecutor from "../../utils/commands/executors/MarryExecutor";

const MarryCommand = createCommand({
name: 'casar',
    nameLocalizations: {
        "en-US": "marry"
    },
    description: "[❤] - Case-se com seu parceiro(a)",
    descriptionLocalizations: {
        "en-US": "[❤] - Marry your partner"
    },
    options: [{
        name: "user",
        nameLocalizations: {
            "pt-BR": "usuário",
        },
        description: "[👥] Usuário que você deseja casar",
        descriptionLocalizations: {
            "en-US": "[👥] User you want to marry"
        },
        type: ApplicationCommandOptionTypes.User,
        required: true
    }],
    category: "social",
    commandRelatedExecutions: [MarryExecutor],
    execute: async (context, endCommand, t) => {
        const user = context.getOption<User>('user', 'users');

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

        if (futurePartnerData.marriedWith) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarriedWithSomeone'))
            })
            return endCommand();
        }

        if (userData.marriedWith) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarried'))
            })
            return endCommand();
        }

        if (user.id === userData.marriedWith) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t('commands:marry.alreadyMarriedWithUser', { user: user.username }))
            })
            return endCommand();
        }

        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_YAY, t('commands:marry.ask', { user: user.username, author: context.author.username })),
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, context.commandId),
                label: t('commands:marry.accept'),
                style: ButtonStyles.Success
            })])],
        });
        
        endCommand();
    }
});

export default MarryCommand;