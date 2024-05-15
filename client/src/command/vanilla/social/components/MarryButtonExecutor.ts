import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";

const MarryButtonExecutor = async (context: ComponentInteractionContext) => {
    const userData = await bot.database.getUser(context.author.id);
    const partnerData = await bot.database.getUser(context.interaction.user.id);

    userData.marryStatus.marriedWith = String(context.user.id);
    userData.marryStatus.marriedDate = new Date();
    partnerData.marryStatus.marriedWith = String(context.user.id);
    partnerData.marryStatus.marriedDate = new Date();
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

export default MarryButtonExecutor;