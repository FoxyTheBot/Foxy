import { ButtonStyles } from "discordeno/types";
import { MessageFlags } from "../../utils/discord/Message";
import { bot } from "../../index";
import { createCommand } from "../../structures/commands/createCommand";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import executeDivorce from "../../structures/commands/modules/executeDivorce";

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
                content: ctx.makeReply(bot.emotes.error, t("commands:divorce.notMarried")),
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