import ComponentInteractionContext from "../ComponentInteractionContext";
import { bot } from "../../../index";
import { MessageFlags } from "../../../utils/discord/Message";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

const executeDivorce = async (ctx: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(ctx.user.id);
    const partnerId = await userData.marriedWith;

    if (!partnerId) {
        ctx.foxyReply({
            content: ctx.makeReply(bot.emotes.error, bot.locale("commands:divorce.notMarried")),
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
        content: ctx.makeReply(bot.emotes.error, bot.locale("commands:divorce.divorced", { user: userInfo.username })),
        components: [createActionRow([createButton({
            customId: createCustomId(0, ctx.user.id, ctx.commandId),
            label: bot.locale("commands:divorce.confirmed"),
            style: ButtonStyles.Danger,
            disabled: true
        })])],

    })
}

export default executeDivorce;