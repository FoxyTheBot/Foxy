import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import { MessageFlags } from "../../../utils/discord/Message";
import { bot } from "../../../index";
import ChatInputInteractionContext from "../../structures/ChatInputInteractionContext";

export default async function DivorceExecutor(context: ChatInputInteractionContext, endCommand, t) {
    const userData = await bot.database.getUser(context.author.id);
    const partnerId = await userData.marriedWith;

    if (!partnerId) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:divorce.notMarried")),
            flags: MessageFlags.EPHEMERAL
        })
        return endCommand();
    }

    const userInfo = await bot.helpers.getUser(userData.marriedWith);

    context.sendReply({
        content: t("commands:divorce.confirm2", { user: await bot.foxyRest.getUserDisplayName(userInfo.id) }),
        components: [createActionRow([createButton({
            customId: createCustomId(0, context.author.id, context.commandId),
            label: t("commands:divorce.confirm"),
            style: ButtonStyles.Danger
        }),
        ])],
        flags: MessageFlags.EPHEMERAL
    })

    endCommand();
}