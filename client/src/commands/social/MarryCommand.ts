import { bot } from "../../index";
import { createCommand } from "../../structures/commands/createCommand";
import { createButton, createCustomId, createActionRow } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { User } from "discordeno/transformers";
import executeMarry from "../../structures/commands/modules/executeMarry";

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
    commandRelatedExecutions: [executeMarry],
    execute: async (ctx, endCommand, t) => {
        const user = ctx.getOption<User>('user', 'users');

        if (!user) {
            ctx.foxyReply({
                content: ctx.makeReply(bot.emotes.error, t('commands:global.noUser'))
            })
            return endCommand();
        }

        if (user.id === ctx.author.id) {
            ctx.foxyReply({
                content: ctx.makeReply(bot.emotes.error, t('commands:marry.self'))
            })
            return endCommand();
        }

        if (user.id === bot.id) {
            ctx.foxyReply({
                content: ctx.makeReply(bot.emotes.error, t('commands:marry.bot'))
            })
            return endCommand();
        }

        const userData = await bot.database.getUser(ctx.author.id);
        const futurePartnerData = await bot.database.getUser(user.id);

        if (futurePartnerData.marriedWith) {
            ctx.foxyReply({
                content: ctx.makeReply(bot.emotes.error, t('commands:marry.alreadyMarriedWithSomeone'))
            })
            return endCommand();
        }

        if (userData.marriedWith) {
            ctx.foxyReply({
                content: ctx.makeReply(bot.emotes.error, t('commands:marry.alreadyMarried'))
            })
            return endCommand();
        }

        if (user.id === userData.marriedWith) {
            ctx.foxyReply({
                content: ctx.makeReply(bot.emotes.error, t('commands:marry.alreadyMarriedWithUser', { user: user.username }))
            })
            return endCommand();
        }

        ctx.foxyReply({
            content: ctx.makeReply("❤", t('commands:marry.ask', { user: user.username, author: ctx.author.username })),
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, ctx.commandId),
                label: t('commands:marry.accept'),
                style: ButtonStyles.Success
            })])],
        });
        
        endCommand();
    }
});

export default MarryCommand;