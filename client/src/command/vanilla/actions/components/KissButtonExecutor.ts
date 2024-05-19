import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";
import { createEmbed } from "../../../../utils/discord/Embed";

const KissExecutor = async (context: ComponentInteractionContext) => {
    const [user, messageId] = context.sentData;
    const kissGif: any = await context.getImage("kiss");
    const embed = createEmbed({});
    let commandAuthor = await bot.foxyRest.getUserDisplayName(context.author.id);
    
    if (messageId) {
        const message = bot.messages.get(BigInt(messageId));
        commandAuthor = await bot.foxyRest.getUserDisplayName(message.authorId);
    }

    embed.title = bot.locale('commands:kiss.success', { user: commandAuthor, author: user }),
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