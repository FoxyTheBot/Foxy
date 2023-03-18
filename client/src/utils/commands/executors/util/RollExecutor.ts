import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";

const RollExecutor = async (context: ComponentInteractionContext) => {
    const [amount, sides] = context.sentData;
    const roll = Math.floor(Number(amount) * Math.random() * Number(sides)) + 1;

    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_YAY, bot.locale('commands:roll.result', { amount: amount.toString(), sides: sides.toString(), result: roll.toString() })),
        components: [createActionRow([createButton({
            label: bot.locale('commands:roll.button'),
            style: ButtonStyles.Primary,
            customId: createCustomId(0, context.author.id, context.commandId, amount, sides)
        })])]
    });
}

export default RollExecutor;