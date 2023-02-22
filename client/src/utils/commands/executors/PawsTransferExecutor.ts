import ComponentInteractionContext from "../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../index";
import { createActionRow, createCustomId, createButton } from "../../discord/Component";
import { ButtonStyles } from "discordeno/types";

const PawsTransferExecutor = async (context: ComponentInteractionContext) => {  
    const [value, user] = context.sentData;
    console.log(value)
    const userData = await bot.database.getUser(user);
    const authorData = await bot.database.getUser(context.author.id);
    userData.balance += Number(value);
    authorData.balance -= Number(value);
    await userData.save();
    authorData.save();

    context.sendReply({
        content: context.makeReply(bot.emotes.success, bot.locale('commands:pay.success', { user: `<@${context.user.id}>`, amount: value })),
        components: [
            createActionRow([createButton({
                label: bot.locale('commands:pay.pay'),
                style: ButtonStyles.Secondary,
                customId: createCustomId(0, context.author.id, context.commandId, value),
                disabled: true,
            })])
        ]
    })
}

export default PawsTransferExecutor;