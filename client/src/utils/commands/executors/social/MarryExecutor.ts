import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";

const MarryExecutor = async (context: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(context.author.id);
    const partnerData = await bot.database.getUser(context.interaction.user.id);

    userData.marriedWith = context.user.id;
    userData.marriedDate = new Date();
    partnerData.marriedWith = context.author.id;
    partnerData.marriedDate = new Date();
    await userData.save();
    await partnerData.save();

    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_YAY, bot.locale("commands:marry.accepted")),
        components: [createActionRow([createButton({
            customId: createCustomId(0, context.interaction.data.targetId, context.commandId),
            label: bot.locale("commands:marry.acceptedButton"),
            style: ButtonStyles.Success,
            emoji: {
                name: "💍"
            },
            disabled: true
        })])],
    })
}

export default MarryExecutor;