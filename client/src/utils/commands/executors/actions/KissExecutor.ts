import ComponentInteractionContext from "../../../../structures/commands/ComponentInteractionContext";
import { bot } from "../../../../index";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../discord/Component";
import {createEmbed} from "../../../discord/Embed";
import gifs from 'nekos.life';
const gif = new gifs();

const KissExecutor = async (context: ComponentInteractionContext) => {
    const [user] = context.sentData;
    const kissGif = await gif.kiss();
    const embed = createEmbed({});
    embed.title = bot.locale('commands:kiss.success', { user: context.author.username, author: user }),
        embed.image = {
            url: kissGif.url
        }

    context.sendReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:kiss.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                id: bot.emotes.FOXY_CUPCAKE
            },
            disabled: true
        })])]
    });
    context.followUp({
        embeds: [embed],
    });
}

export default KissExecutor;