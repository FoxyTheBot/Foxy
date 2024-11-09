import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { createEmbed } from "../../../../utils/discord/Embed";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";

const SlapExecutor = async (context: ComponentInteractionContext) => {
    const [user, messageId, channelId] = context.sentData;
    const slapGif = await bot.rest.foxy.getImage("roleplay", "slap");
    const embed = createEmbed({});
    let commandAuthor = await bot.rest.foxy.getUserDisplayName(context.author.id);
    
    if (messageId) {
        const message = bot.messages.get(BigInt(messageId)) || (await bot.helpers.getMessage(channelId, messageId));
        commandAuthor = await bot.rest.foxy.getUserDisplayName(message.authorId);
    }

    embed.title = bot.locale('commands:slap.success', { user: commandAuthor, author: user }),
        embed.image = {
            url: slapGif.url
        }

    context.reply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:slap.button'),
            style: ButtonStyles.Secondary,
            emoji: {
                id: BigInt(bot.emotes.FOXY_SCARED),
            },
            disabled: true
        })])]
    });
    context.followUp({
        embeds: [embed],
    });
}

export default SlapExecutor;