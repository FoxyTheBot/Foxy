import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";

const FightDeclineExecutor = async (context: ComponentInteractionContext) => {
    context.sendReply({
        content: context.makeReply(bot.emotes.FOXY_CRY, bot.locale('commands:fight.declined')),
        embeds: null,
         components: [createActionRow([createButton({
                label: bot.locale('commands:fight.accept'),
                style: ButtonStyles.Success,
                customId: createCustomId(0, context.author.id, context.commandId),
                disabled: true
            }), createButton({
                label: bot.locale('commands:fight.decline'),
                style: ButtonStyles.Danger,
                customId: createCustomId(0, context.author.id, context.commandId),
                disabled: true
            })])]
    })
}

export default FightDeclineExecutor;