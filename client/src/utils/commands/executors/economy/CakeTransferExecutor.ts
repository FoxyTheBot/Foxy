import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createActionRow, createCustomId, createButton } from "../../../discord/Component";
import { ButtonStyles } from "discordeno/types";

const CakeTransferExecutor = async (context: ComponentInteractionContext) => {
    const [value, user] = context.sentData;

    const userData = await bot.database.getUser(user);
    const authorData = await bot.database.getUser(context.author.id);
    userData.balance += Number(value);
    authorData.balance -= Number(value);
    authorData.transactions.push({
        to: user,
        from: context.author.id,
        quantity: Number(value),
        date: Date.now(),
        received: false,
        type: 'send'
    }) && userData.transactions.push({
        to: user,
        from: context.author.id,
        quantity: Number(value),
        date: Date.now(),
        received: true,
        type: 'receive'
    });

    await userData.save();
    authorData.save();

    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_YAY, bot.locale('commands:pay.success', { user: `<@${user}>`, amount: value })),
        components: [
            createActionRow([createButton({
                label: bot.locale('commands:pay.transfered'),
                style: ButtonStyles.Secondary,
                customId: createCustomId(0, context.author.id, context.commandId, value),
                disabled: true,
                emoji: {
                    id: bot.emotes.FOXY_DAILY
                }
            })])
        ]
    })
}

export default CakeTransferExecutor;