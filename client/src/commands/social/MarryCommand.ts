import { bot } from "../../index";
import ComponentInteractionContext from "../../structures/commands/ComponentInteractionContext";
import { createCommand } from "../../structures/commands/createCommand";
import { createButton, createCustomId, createActionRow } from "../../utils/discord/Component";
import { ApplicationCommandOptionTypes, ButtonStyles } from "discordeno/types";
import { User } from "discordeno/transformers";

const executeMarry = async (ctx: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(ctx.commandAuthor.id);
    const partnerData = await bot.database.getUser(ctx.interaction.user.id);

    userData.marriedWith = ctx.user.id;
    userData.marriedDate = new Date();
    partnerData.marriedWith = ctx.commandAuthor.id;
    partnerData.marriedDate = new Date();
    await userData.save();
    await partnerData.save();

    ctx.foxyReply({
        content: ctx.prettyReply("❤", bot.locale("commands:marry.accepted")),
        components: [createActionRow([createButton({
            customId: createCustomId(0, ctx.interaction.data.targetId, ctx.commandId),
            label: bot.locale("commands:marry.accept"),
            style: ButtonStyles.Success,
            disabled: true
        })])],
    })
}

const MarryCommand = createCommand({
    path: '',
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
        description: "Usuário que você deseja casar",
        descriptionLocalizations: {
            "en-US": "User you want to marry"
        },
        type: ApplicationCommandOptionTypes.User,
    }],
    category: "social",
    authorDataFields: [],
    commandRelatedExecutions: [executeMarry],
    execute: async (ctx, finishCommand, t) => {
        const user = ctx.getOption<User>('user', 'users');

        if (!user) {
            ctx.foxyReply({
                content: ctx.prettyReply(bot.emotes.error, t('commands:global.noUser'))
            })
            return finishCommand();
        }

        if (user.id === ctx.author.id) {
            ctx.foxyReply({
                content: ctx.prettyReply(bot.emotes.error, t('commands:marry.self'))
            })
            return finishCommand();
        }

        if (user.id === bot.id) {
            ctx.foxyReply({
                content: ctx.prettyReply(bot.emotes.error, t('commands:marry.bot'))
            })
            return finishCommand();
        }

        const userData = await bot.database.getUser(ctx.author.id);
        const futurePartnerData = await bot.database.getUser(user.id);

        if (futurePartnerData.marriedWith) {
            ctx.foxyReply({
                content: ctx.prettyReply(bot.emotes.error, t('commands:marry.alreadyMarriedWithSomeone'))
            })
            return finishCommand();
        }

        if (userData.marriedWith) {
            ctx.foxyReply({
                content: ctx.prettyReply(bot.emotes.error, t('commands:marry.alreadyMarried'))
            })
            return finishCommand();
        }

        if (user.id === userData.marriedWith) {
            ctx.foxyReply({
                content: ctx.prettyReply(bot.emotes.error, t('commands:marry.alreadyMarriedWithUser', { user: user.username }))
            })
            return finishCommand();
        }

        ctx.foxyReply({
            content: ctx.prettyReply("❤", t('commands:marry.ask', { user: user.username, author: ctx.author.username })),
            components: [createActionRow([createButton({
                customId: createCustomId(0, user.id, ctx.commandId),
                label: t('commands:marry.accept'),
                style: ButtonStyles.Success
            })])],
        });
        
        finishCommand();
    }
});

export default MarryCommand;