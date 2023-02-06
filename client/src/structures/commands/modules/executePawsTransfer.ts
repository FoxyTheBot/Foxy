import ComponentInteractionContext from "../ComponentInteractionContext";
import { bot } from "../../../index";
import { createActionRow, createCustomId, createButton } from "../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";

const executePawsTransfer = async (ctx: ComponentInteractionContext) => {  
    const [value] = ctx.sentData; 
    const userData = await bot.database.getUser(ctx.user.id);
    const authorData = await bot.database.getUser(ctx.author.id);
    userData.balance += Number(value);
    authorData.balance -= Number(value);
    userData.save();
    authorData.save();
    
    ctx.foxyReply({
        content: ctx.makeReply(bot.emotes.success, bot.locale('commands:pay.success', { user: ctx.interaction.user.id })),
        components: [
            createActionRow([createButton({
                label: bot.locale('commands:pay.pay'),
                style: ButtonStyles.Success,
                customId: createCustomId(0, ctx.author.id, ctx.commandId, value),
                disabled: true,
            })])
        ]
    })
}

export default executePawsTransfer;