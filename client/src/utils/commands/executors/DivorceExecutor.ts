import ComponentInteractionContext from "../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../index";
import { MessageFlags } from "../../../utils/discord/Message";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

const DivorceExecutor = async (context: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(context.user.id);
    const partnerId = await userData.marriedWith;

    if (!partnerId) {
        context.sendReply({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale("commands:divorce.notMarried")),
            flags: MessageFlags.Ephemeral
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

    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale("commands:divorce.divorced", { user: userInfo.username })),
        components: [createActionRow([createButton({
            customId: createCustomId(0, context.user.id, context.commandId),
            label: bot.locale("commands:divorce.confirmed"),
            style: ButtonStyles.Danger,
            disabled: true
        })])],

    })
}

export default DivorceExecutor;