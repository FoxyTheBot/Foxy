import { ButtonStyles } from "discordeno/types";
import { bot } from "../../index";
import ComponentInteractionContext from "../../structures/commands/ComponentInteractionContext";
import { createCommand } from "../../structures/commands/createCommand";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";

const executeDivorce = async (ctx: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(ctx.user.id);
    const partnerId = await bot.database.getUser(userData.marriedWith);

    if (!partnerId) {
        ctx.foxyReply({
            content: ctx.prettyReply(bot.emotes.error, bot.locale("commands:divorce.notMarried"))
        });
        return;
    }

    const userInfo = await bot.helpers.getUser(userData.marriedWith);

    userData.marriedWith = null;
    userData.marriedDate = null;
    partnerId.marriedWith = null;
    partnerId.marriedDate = null;
    await userData.save();
    await partnerId.save();

    ctx.prettyReply(bot.emotes.error, bot.locale("commands:divorce.divorced", { user: userInfo.username }));
    const getButton = ctx.interaction.message.components[0].components[0];
    getButton.disabled = true;
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
        const partnerId = await bot.database.getUser(userData.marriedWith);

        if (!partnerId) {
            ctx.prettyReply(bot.emotes.error, t("commands:divorce.notMarried"));
            return finishCommand();
        }

        const userInfo = await bot.helpers.getUser(userData.marriedWith);

        const confirmButton = createButton({
            customId: createCustomId(0, ctx.author.id, ctx.commandId),
            label: t("commands:divorce.confirm"),
            style: ButtonStyles.Danger
        });

        ctx.foxyReply({
            content: t("commands:divorce.confirm2", { user: userInfo.username }),
            components: [createActionRow([confirmButton])]
        })

        finishCommand();
    }
});

export default DivorceCommand;