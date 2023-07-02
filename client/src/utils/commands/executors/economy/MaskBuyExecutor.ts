import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { createActionRow, createCustomId, createButton, createSelectMenu } from "../../../discord/Component";
import { MessageFlags } from '../../../discord/Message';
import { ButtonStyles } from "discordeno/types";

const MaskBuyExecutor = async (context: ComponentInteractionContext) => {
    const [code, mask, subCommand] = context.sentData;

    const userData = await bot.database.getUser(context.author.id);
    const clientData = await bot.database.getUser(bot.id);

    if (userData.balance < mask) {
        context.sendReply({
            flags: MessageFlags.EPHEMERAL
        });
        context.followUp({
            content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:masks.buy.noMoney')),
            flags: MessageFlags.EPHEMERAL
        });
    } else {
        userData.balance -= Number(mask);
        clientData.balance += Number(mask);
        userData.mask = code;
        userData.masks.push(code);
        await userData.save();
        context.sendReply({
            content: bot.locale('commands:masks.buy.success'),
            flags: MessageFlags.EPHEMERAL,
            components: [createActionRow([createButton({
                customId: createCustomId(1, context.author.id, context.commandId, code, mask, subCommand),
                label: bot.locale('commands:masks.buy.purchase'),
                style: ButtonStyles.Secondary,
                emoji: {
                    id: bot.emotes.FOXY_DAILY
                },
                disabled: true
            })])]
        });
    }
}

export default MaskBuyExecutor;