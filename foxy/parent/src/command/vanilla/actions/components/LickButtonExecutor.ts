import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";
import { createEmbed } from "../../../../utils/discord/Embed";

const LickExecutor = async (context: ComponentInteractionContext) => {
    const [user, messageId, channelId] = context.sentData;
    const lickGif = await bot.rest.foxy.getImage("roleplay", "lick");
    const embed = createEmbed({});
    let commandAuthor = await bot.rest.foxy.getUserDisplayName(context.author.id);
    
    if (messageId) {
        const message = bot.messages.get(BigInt(messageId)) || (await bot.helpers.getMessage(channelId, messageId));
        commandAuthor = await bot.rest.foxy.getUserDisplayName(message.authorId);
    }

    embed.title = bot.locale('commands:lick.success', { user: commandAuthor, author: user }),
        embed.image = {
            url: lickGif.url
        }

    context.reply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:lick.button'),
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

export default LickExecutor;