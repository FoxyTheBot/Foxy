import { ButtonStyles } from "discordeno/types";
import { MessageFlags } from "../../utils/discord/Message";
import { bot } from "../../index";
import ComponentInteractionContext from "../../structures/commands/ComponentInteractionContext";
import { createCommand } from "../../structures/commands/createCommand";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";

const executeDivorce = async (ctx: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(ctx.user.id);
    const partnerId = await userData.marriedWith;

    if (!partnerId) {
        ctx.foxyReply({
            content: ctx.prettyReply(bot.emotes.error, bot.locale("commands:divorce.notMarried")),
            flags: MessageFlags.EPHEMERAL
        });
        return;
    }

    const partnerData = await bot.database.getUser(partnerId);
    const userInfo = await bot.helpers.getUser(userData.marriedWith);

    userData.marriedWith = null;
    userData.marriedDate = null;
    partnerData.marriedWith = null;
    partnerData.marriedDate = null;
    await userData.save();
    await partnerData.save();

    ctx.foxyReply({
        content: ctx.prettyReply(bot.emotes.error, bot.locale("commands:divorce.divorced", { user: userInfo.username })),
        components: [createActionRow([createButton({
            customId: createCustomId(0, ctx.user.id, ctx.commandId),
            label: bot.locale("commands:divorce.confirmed"),
            style: ButtonStyles.Danger,
            disabled: true
        })])],

    })

}

const DivorceCommand = createCommand({
    path: '',
    name: 'divorciar',
    nameLocalizations: {
        "en-US": "divorce"
    },
    description: "Divorcie-se de seu parceiro",
    descriptionLocalizations: {
        "en-US": "Divorce your partner"
    },
    category: "social",
    authorDataFields: [],
    commandRelatedExecutions: [executeDivorce],
    execute: async (ctx, finishCommand, t) => {
        const userData = await bot.database.getUser(ctx.author.id);
        const partnerId = await userData.marriedWith;

        if (!partnerId) {
            ctx.foxyReply({
                content: ctx.prettyReply(bot.emotes.error, t("commands:divorce.notMarried")),
                flags: MessageFlags.EPHEMERAL
            })
            return finishCommand();
        }

        const userInfo = await bot.helpers.getUser(userData.marriedWith);

        ctx.foxyReply({
            content: t("commands:divorce.confirm2", { user: userInfo.username }),
            components: [createActionRow([createButton({
                customId: createCustomId(0, ctx.author.id, ctx.commandId),
                label: t("commands:divorce.confirm"),
                style: ButtonStyles.Danger
            }),
            ])],
            flags: MessageFlags.EPHEMERAL
        })

        finishCommand();
    }
});

export default DivorceCommand;