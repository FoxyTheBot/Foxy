import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import { MessageFlags } from "../../../utils/discord/Message";
import { bot } from "../../../FoxyLauncher";
import UnleashedCommandExecutor from "../../structures/UnleashedCommandExecutor";

export default async function DivorceExecutor(context: UnleashedCommandExecutor, endCommand, t) {
    const userData = await bot.database.getUser(context.author.id);
    const partnerId = await userData.marryStatus.marriedWith;

    if (!partnerId) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:divorce.notMarried")),
            flags: MessageFlags.EPHEMERAL
        })
        return endCommand();
    }

    const userInfo = await bot.users.get(BigInt(userData.marryStatus.marriedWith))
        ?? bot.helpers.getUser(userData.marryStatus.marriedWith);

    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:divorce.confirm2", { user: await bot.rest.foxy.getUserDisplayName((await userInfo).id) })),
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