import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createActionRow, createCustomId, createButton } from "../../../../utils/discord/Component";
import { ButtonStyles } from "discordeno/types";

const CakeTransferExecutor = async (context: ComponentInteractionContext) => {
    const [value, user] = context.sentData;

    const userData = await bot.database.getUser(BigInt(user));
    const authorData = await bot.database.getUser(context.author.id);
    userData.userCakes.balance += Number(value);
    authorData.userCakes.balance -= Number(value);
    authorData.userTransactions.push({
        to: user,
        from: String(context.author.id),
        quantity: Number(value),
        date: new Date(Date.now()),
        received: false,
        type: 'send'
    }) && userData.userTransactions.push({
        to: user,
        from: String(context.author.id),
        quantity: Number(value),
        date: new Date(Date.now()),
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