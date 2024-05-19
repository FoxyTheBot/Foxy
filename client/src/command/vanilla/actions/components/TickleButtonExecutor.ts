import ComponentInteractionContext from "../../../structures/ComponentInteractionContext";
import { bot } from "../../../../FoxyLauncher";
import { ButtonStyles } from "discordeno/types";
import { createActionRow, createButton, createCustomId } from "../../../../utils/discord/Component";
import { createEmbed } from "../../../../utils/discord/Embed";

const TickleExecutor = async (context: ComponentInteractionContext) => {
    const [user, messageId] = context.sentData;
    const tickleGif: any = await context.getImage("tickle");
    const embed = createEmbed({});
    let commandAuthor = await bot.foxyRest.getUserDisplayName(context.author.id);

    if (messageId) {
        const message = bot.messages.get(BigInt(messageId));
        commandAuthor = await bot.foxyRest.getUserDisplayName(message.authorId);
    }
    
    embed.title = bot.locale('commands:tickle.success', { user: commandAuthor, author: user }),
        embed.image = {
            url: tickleGif.url
        }

    context.sendReply({
        components: [createActionRow([createButton({
            customId: createCustomId(0, user, context.commandId),
            label: bot.locale('commands:tickle.button'),
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

export default TickleExecutor;