import { ButtonStyles } from "discordeno/types";
import { MessageFlags } from "../../utils/discord/Message";
import { bot } from "../../index";
import { createCommand } from "../../structures/commands/createCommand";
import { createActionRow, createButton, createCustomId } from "../../utils/discord/Component";
import DivorceExecutor from "../../utils/commands/executors/DivorceExecutor";

const DivorceCommand = createCommand({
name: 'divorciar',
    nameLocalizations: {
        "en-US": "divorce"
    },
    description: "[👥] Divorcie-se de seu parceiro",
    descriptionLocalizations: {
        "en-US": "[👥] Divorce your partner"
    },
    category: "social",
    commandRelatedExecutions: [DivorceExecutor],
    execute: async (context, endCommand, t) => {
        const userData = await bot.database.getUser(context.author.id);
        const partnerId = await userData.marriedWith;

        if (!partnerId) {
            context.sendReply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:divorce.notMarried")),
                flags: MessageFlags.Ephemeral
            })
            return endCommand();
        }

        const userInfo = await bot.helpers.getUser(userData.marriedWith);

        context.sendReply({
            content: t("commands:divorce.confirm2", { user: userInfo.username }),
            components: [createActionRow([createButton({
                customId: createCustomId(0, context.author.id, context.commandId),
                label: t("commands:divorce.confirm"),
                style: ButtonStyles.Danger
            }),
            ])],
            flags: MessageFlags.Ephemeral
        })

        endCommand();
    }
});

export default DivorceCommand;