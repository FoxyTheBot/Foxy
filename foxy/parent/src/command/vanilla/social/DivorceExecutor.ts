import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";
import { MessageFlags } from "../../../utils/discord/Message";
import { bot } from "../../../FoxyLauncher";
import { ExecutorParams } from "../../structures/CommandExecutor";

export default class DivorceExecutor {
    async execute({ context, endCommand, t }: ExecutorParams) {
        const userData = await bot.database.getUser((await context.getAuthor()).id);
        context.sendDefer(true);
        const partnerId = await userData.marryStatus.marriedWith;

        if (!partnerId) {
            context.reply({
                content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:divorce.notMarried")),
                flags: MessageFlags.EPHEMERAL
            })
            return endCommand();
        }

        const userInfo = await bot.helpers.foxy.getUser(userData.marryStatus.marriedWith);

        context.reply({
            content: context.makeReply(bot.emotes.FOXY_CRY, t("commands:divorce.confirm2", { user: await bot.rest.foxy.getUserDisplayName((await userInfo).id) })),
            components: [createActionRow([createButton({
                customId: createCustomId(0, (await context.getAuthor()).id, context.commandId),
                label: t("commands:divorce.confirm"),
                style: ButtonStyles.Danger
            }),
            ])],
            flags: MessageFlags.EPHEMERAL
        })

        return endCommand();
    }
}