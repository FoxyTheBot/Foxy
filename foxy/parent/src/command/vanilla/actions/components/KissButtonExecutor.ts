import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";
import { createEmbed } from "../../../../utils/discord/Embed";

const KissExecutor = async (context: ComponentInteractionContext) => {
    const [user, messageId, channelId] = context.sentData;
    const kissGif = await bot.rest.foxy.getImage("roleplay", "kiss");
    const embed = createEmbed({});
    let commandAuthor = await bot.rest.foxy.getUserDisplayName(context.author.id);
    
    if (messageId) {
        const message = bot.messages.get(BigInt(messageId)) || (await bot.helpers.getMessage(channelId, messageId));
        commandAuthor = await bot.rest.foxy.getUserDisplayName(message.authorId);
    }

    embed.title = bot.locale('commands:kiss.success', { user: commandAuthor, author: user }),
        embed.image = {
            url: kissGif.url
        }

    context.reply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:kiss.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                id: BigInt(bot.emotes.FOXY_CUPCAKE)
            },
            disabled: true
        })])]
    });
    context.followUp({
        embeds: [embed],
    });
}

export default KissExecutor;