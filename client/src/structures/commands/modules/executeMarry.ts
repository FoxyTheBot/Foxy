import ComponentInteractionContext from "../ComponentInteractionContext";
import { bot } from "../../../index";
import { MessageFlags } from "../../../utils/discord/Message";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../utils/discord/Component";

const executeMarry = async (ctx: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(ctx.author.id);
    const partnerData = await bot.database.getUser(ctx.interaction.user.id);

    userData.marriedWith = ctx.user.id;
    userData.marriedDate = new Date();
    partnerData.marriedWith = ctx.author.id;
    partnerData.marriedDate = new Date();
    await userData.save();
    await partnerData.save();

    ctx.foxyReply({
        content: ctx.makeReply("❤", bot.locale("commands:marry.accepted")),
        components: [createActionRow([createButton({
            customId: createCustomId(0, ctx.interaction.data.targetId, ctx.commandId),
            label: bot.locale("commands:marry.accept"),
            style: ButtonStyles.Success,
            disabled: true
        })])],
    })
}

export default executeMarry;