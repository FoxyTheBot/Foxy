import { MessageComponentTypes } from "discordeno/types";
import { bot } from "../../../../FoxyLauncher";
import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { createCustomId } from "../../../../utils/discord/Component";

const RankSelectorExecutor = async (context: ComponentInteractionContext) => {
    const rank = context.interaction.data.values[0];

    context.sendReply({
        embeds: [{
            title: context.makeReply(bot.emotes.VALORANT_LOGO, "VALORANT Autorole"),
            description: bot.locale("commands:valorant.autorole.rankSelector.description", { rank }),
            color: bot.colors.VALORANT
        }],
        components: [{
            type: MessageComponentTypes.ActionRow,
            components: [{
                type: MessageComponentTypes.SelectMenuRoles,
                customId: createCustomId(3, context.author.id, context.commandId, rank),
                placeholder: bot.locale("commands:valorant.autorole.rankSelector.placeholder"),
            }]
        }]
    })
}

export default RankSelectorExecutor;